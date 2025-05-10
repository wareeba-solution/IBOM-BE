// src/api/services/backup.service.js
const { sequelize } = require('../../models');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const AppError = require('../../utils/appError');
const settingService = require('./setting.service');
const auditService = require('./audit.service');

class BackupService {
  async createBackup(backupData, userId) {
    const { description, includeFiles, modules } = backupData;
    
    try {
      // Create a unique backup file name
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupId = `backup_${timestamp}`;
      const backupDir = await this.getBackupDirectory();
      
      // Ensure backup directory exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Create backup metadata
      const metadata = {
        id: backupId,
        description,
        createdAt: new Date(),
        createdBy: userId,
        includeFiles,
        modules,
        status: 'in_progress',
        databaseBackupPath: null,
        filesBackupPath: null
      };
      
      // Save metadata
      const metadataPath = path.join(backupDir, `${backupId}_metadata.json`);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      // Perform database backup
      const databaseBackupPath = await this.performDatabaseBackup(backupDir, backupId, modules);
      metadata.databaseBackupPath = databaseBackupPath;
      
      // If includeFiles is true, backup files as well
      if (includeFiles) {
        const filesBackupPath = await this.performFilesBackup(backupDir, backupId);
        metadata.filesBackupPath = filesBackupPath;
      }
      
      // Update metadata with success status
      metadata.status = 'completed';
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      // Log the backup action
      await auditService.logAction({
        action: 'create_backup',
        entityType: 'backup',
        entityId: backupId,
        newValues: { description, includeFiles, modules },
        userId
      });
      
      return {
        id: backupId,
        description,
        createdAt: metadata.createdAt,
        status: 'completed'
      };
    } catch (error) {
      throw new AppError(`Backup failed: ${error.message}`, 500);
    }
  }

  async restoreBackup(backupId, password, userId) {
    try {
      const backupDir = await this.getBackupDirectory();
      const metadataPath = path.join(backupDir, `${backupId}_metadata.json`);
      
      // Check if backup exists
      if (!fs.existsSync(metadataPath)) {
        throw new AppError('Backup not found', 404);
      }
      
      // Read backup metadata
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      // Check database backup file exists
      if (!metadata.databaseBackupPath || !fs.existsSync(metadata.databaseBackupPath)) {
        throw new AppError('Database backup file not found', 404);
      }
      
      // Restore database
      await this.restoreDatabaseBackup(metadata.databaseBackupPath, metadata.modules, password);
      
      // Restore files if they were backed up
      if (metadata.includeFiles && metadata.filesBackupPath && fs.existsSync(metadata.filesBackupPath)) {
        await this.restoreFilesBackup(metadata.filesBackupPath);
      }
      
      // Log the restore action
      await auditService.logAction({
        action: 'restore_backup',
        entityType: 'backup',
        entityId: backupId,
        userId
      });
      
      return {
        id: backupId,
        description: metadata.description,
        restoredAt: new Date(),
        status: 'restored'
      };
    } catch (error) {
      throw new AppError(`Restore failed: ${error.message}`, 500);
    }
  }

  async getBackups(page = 1, limit = 10) {
    try {
      const backupDir = await this.getBackupDirectory();
      
      // Ensure backup directory exists
      if (!fs.existsSync(backupDir)) {
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0
          }
        };
      }
      
      // Get all metadata files
      const files = fs.readdirSync(backupDir)
        .filter(file => file.endsWith('_metadata.json'));
      
      // Read metadata from each file
      const backups = files.map(file => {
        const metadata = JSON.parse(fs.readFileSync(path.join(backupDir, file), 'utf8'));
        return {
          id: metadata.id,
          description: metadata.description,
          createdAt: metadata.createdAt,
          createdBy: metadata.createdBy,
          status: metadata.status,
          includeFiles: metadata.includeFiles,
          modules: metadata.modules
        };
      });
      
      // Sort by creation date (newest first)
      backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Paginate results
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBackups = backups.slice(startIndex, endIndex);
      
      return {
        data: paginatedBackups,
        meta: {
          total: backups.length,
          page,
          limit,
          totalPages: Math.ceil(backups.length / limit)
        }
      };
    } catch (error) {
      throw new AppError(`Failed to retrieve backups: ${error.message}`, 500);
    }
  }

  async getBackupById(backupId) {
    try {
      const backupDir = await this.getBackupDirectory();
      const metadataPath = path.join(backupDir, `${backupId}_metadata.json`);
      
      // Check if backup exists
      if (!fs.existsSync(metadataPath)) {
        throw new AppError('Backup not found', 404);
      }
      
      // Read backup metadata
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      return {
        id: metadata.id,
        description: metadata.description,
        createdAt: metadata.createdAt,
        createdBy: metadata.createdBy,
        status: metadata.status,
        includeFiles: metadata.includeFiles,
        modules: metadata.modules,
        size: await this.getBackupSize(metadata)
      };
    } catch (error) {
      throw new AppError(`Failed to retrieve backup: ${error.message}`, 500);
    }
  }

  async deleteBackup(backupId, userId) {
    try {
      const backupDir = await this.getBackupDirectory();
      const metadataPath = path.join(backupDir, `${backupId}_metadata.json`);
      
      // Check if backup exists
      if (!fs.existsSync(metadataPath)) {
        throw new AppError('Backup not found', 404);
      }
      
      // Read backup metadata
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      // Delete database backup file
      if (metadata.databaseBackupPath && fs.existsSync(metadata.databaseBackupPath)) {
        fs.unlinkSync(metadata.databaseBackupPath);
      }
      
      // Delete files backup if it exists
      if (metadata.filesBackupPath && fs.existsSync(metadata.filesBackupPath)) {
        fs.unlinkSync(metadata.filesBackupPath);
      }
      
      // Delete metadata file
      fs.unlinkSync(metadataPath);
      
      // Log the delete action
      await auditService.logAction({
        action: 'delete_backup',
        entityType: 'backup',
        entityId: backupId,
        userId
      });
      
      return { success: true };
    } catch (error) {
      throw new AppError(`Failed to delete backup: ${error.message}`, 500);
    }
  }

  // Helper methods
  async getBackupDirectory() {
    // Try to get backup directory from settings
    try {
      const settings = await settingService.getMultipleSettings(['backup_directory']);
      if (settings.backup_directory) {
        return settings.backup_directory;
      }
    } catch (error) {
      console.error('Error getting backup directory from settings:', error);
    }
    
    // Default to a directory in the project root
    return path.join(process.cwd(), 'backups');
  }

  async performDatabaseBackup(backupDir, backupId, modules) {
    // Get database configuration
    const dbConfig = sequelize.config;
    
    let tables = '';
    if (modules && modules.length > 0) {
      // Get tables for specific modules
      // This is simplified - you would need to map modules to tables
      tables = modules.map(module => `--table="${module}s"`).join(' ');
    }
    
    const backupPath = path.join(backupDir, `${backupId}_database.sql`);
    
    // Use pg_dump to create backup
    const command = `PGPASSWORD="${dbConfig.password}" pg_dump -h ${dbConfig.host} -U ${dbConfig.username} -d ${dbConfig.database} ${tables} -f "${backupPath}"`;
    
    await exec(command);
    return backupPath;
  }

  async performFilesBackup(backupDir, backupId) {
    // Get uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return null; // No files to backup
    }
    
    const backupPath = path.join(backupDir, `${backupId}_files.tar.gz`);
    
    // Use tar to create compressed backup
    const command = `tar -czf "${backupPath}" -C "${path.dirname(uploadsDir)}" "${path.basename(uploadsDir)}"`;
    
    await exec(command);
    return backupPath;
  }

  async restoreDatabaseBackup(backupPath, modules, password) {
    // Get database configuration
    const dbConfig = sequelize.config;
    
    // Use psql to restore backup
    const command = `PGPASSWORD="${dbConfig.password}" psql -h ${dbConfig.host} -U ${dbConfig.username} -d ${dbConfig.database} -f "${backupPath}"`;
    
    await exec(command);
  }

  async restoreFilesBackup(backupPath) {
    const destination = process.cwd();
    
    // Use tar to extract files
    const command = `tar -xzf "${backupPath}" -C "${destination}"`;
    
    await exec(command);
  }

  async getBackupSize(metadata) {
    let totalSize = 0;
    
    // Add size of database backup
    if (metadata.databaseBackupPath && fs.existsSync(metadata.databaseBackupPath)) {
      const stats = fs.statSync(metadata.databaseBackupPath);
      totalSize += stats.size;
    }
    
    // Add size of files backup
    if (metadata.filesBackupPath && fs.existsSync(metadata.filesBackupPath)) {
      const stats = fs.statSync(metadata.filesBackupPath);
      totalSize += stats.size;
    }
    
    // Convert to human-readable format
    return this.formatBytes(totalSize);
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

module.exports = new BackupService();