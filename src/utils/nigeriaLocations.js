// utils/nigeriaLocations.js - FIXED VERSION
const { states, lgas } = require('nigerian-states-and-lgas');

/**
 * Utility functions for Nigerian states and LGAs
 * Fixed to work with function-based package exports
 */
class NigeriaLocations {
  /**
   * Get all Nigerian states
   * @returns {Array} Array of state objects
   */
  static getAllStates() {
    try {
      const statesData = states(); // Call the function to get data
      return Object.values(statesData); // Convert object to array
    } catch (error) {
      console.error('Error getting states:', error);
      return [];
    }
  }

  /**
   * Get all LGAs
   * @returns {Array} Array of LGA objects
   */
  static getAllLGAs() {
    try {
      const lgasData = lgas(); // Call the function to get data
      return Object.values(lgasData); // Convert object to array
    } catch (error) {
      console.error('Error getting LGAs:', error);
      return [];
    }
  }

  /**
   * Get LGAs for a specific state
   * @param {string} stateName - Name of the state
   * @returns {Array} Array of LGAs for the specified state
   */
  static getLGAsByState(stateName) {
    if (!stateName) return [];
    
    try {
      const lgasData = lgas(); // Get all LGAs
      const allLGAs = Object.values(lgasData);
      
      return allLGAs.filter(lga => 
        lga.state && lga.state.toLowerCase() === stateName.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting LGAs by state:', error);
      return [];
    }
  }

  /**
   * Get state names only
   * @returns {Array} Array of state names
   */
  static getStateNames() {
    try {
      const statesData = states();
      const allStates = Object.values(statesData);
      return allStates.map(state => state.name || state.state || state);
    } catch (error) {
      console.error('Error getting state names:', error);
      return [];
    }
  }

  /**
   * Get LGA names only
   * @returns {Array} Array of LGA names
   */
  static getLGANames() {
    try {
      const lgasData = lgas();
      const allLGAs = Object.values(lgasData);
      return allLGAs.map(lga => lga.name || lga.lga || lga);
    } catch (error) {
      console.error('Error getting LGA names:', error);
      return [];
    }
  }

  /**
   * Validate if a state exists
   * @param {string} stateName - Name of the state to validate
   * @returns {boolean} True if state exists
   */
  static isValidState(stateName) {
    if (!stateName) return false;
    
    try {
      const statesData = states();
      const allStates = Object.values(statesData);
      
      return allStates.some(state => {
        const name = state.name || state.state || state;
        return name && name.toLowerCase() === stateName.toLowerCase();
      });
    } catch (error) {
      console.error('Error validating state:', error);
      return false;
    }
  }

  /**
   * Validate if an LGA exists
   * @param {string} lgaName - Name of the LGA to validate
   * @param {string} stateName - Optional: validate LGA within specific state
   * @returns {boolean} True if LGA exists
   */
  static isValidLGA(lgaName, stateName = null) {
    if (!lgaName) return false;
    
    try {
      const lgasData = lgas();
      const allLGAs = Object.values(lgasData);
      
      return allLGAs.some(lga => {
        const lgaNameMatch = lga.name && lga.name.toLowerCase() === lgaName.toLowerCase();
        
        if (stateName) {
          const stateMatch = lga.state && lga.state.toLowerCase() === stateName.toLowerCase();
          return lgaNameMatch && stateMatch;
        }
        
        return lgaNameMatch;
      });
    } catch (error) {
      console.error('Error validating LGA:', error);
      return false;
    }
  }

  /**
   * Search states by name (partial match)
   * @param {string} searchTerm - Search term
   * @returns {Array} Matching states
   */
  static searchStates(searchTerm) {
    if (!searchTerm) return [];
    
    try {
      const statesData = states();
      const allStates = Object.values(statesData);
      
      return allStates.filter(state => {
        const name = state.name || state.state || state;
        return name && name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } catch (error) {
      console.error('Error searching states:', error);
      return [];
    }
  }

  /**
   * Search LGAs by name (partial match)
   * @param {string} searchTerm - Search term
   * @param {string} stateName - Optional: search within specific state
   * @returns {Array} Matching LGAs
   */
  static searchLGAs(searchTerm, stateName = null) {
    if (!searchTerm) return [];
    
    try {
      let searchLGAs = stateName ? this.getLGAsByState(stateName) : this.getAllLGAs();
      
      return searchLGAs.filter(lga => {
        const name = lga.name || lga.lga || lga;
        return name && name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } catch (error) {
      console.error('Error searching LGAs:', error);
      return [];
    }
  }

  /**
   * Get state by name
   * @param {string} stateName - Name of the state
   * @returns {Object|null} State object or null if not found
   */
  static getStateByName(stateName) {
    if (!stateName) return null;
    
    try {
      const statesData = states();
      const allStates = Object.values(statesData);
      
      return allStates.find(state => {
        const name = state.name || state.state || state;
        return name && name.toLowerCase() === stateName.toLowerCase();
      }) || null;
    } catch (error) {
      console.error('Error getting state by name:', error);
      return null;
    }
  }

  /**
   * Get LGA by name
   * @param {string} lgaName - Name of the LGA
   * @param {string} stateName - Optional: search within specific state
   * @returns {Object|null} LGA object or null if not found
   */
  static getLGAByName(lgaName, stateName = null) {
    if (!lgaName) return null;
    
    try {
      let searchLGAs = stateName ? this.getLGAsByState(stateName) : this.getAllLGAs();
      
      return searchLGAs.find(lga => {
        const name = lga.name || lga.lga || lga;
        return name && name.toLowerCase() === lgaName.toLowerCase();
      }) || null;
    } catch (error) {
      console.error('Error getting LGA by name:', error);
      return null;
    }
  }

  /**
   * Debug method to inspect data structure
   * @returns {Object} Debug information
   */
  static debug() {
    try {
      const statesData = states();
      const lgasData = lgas();
      
      return {
        statesType: typeof statesData,
        statesCount: Object.keys(statesData).length,
        statesKeys: Object.keys(statesData).slice(0, 5),
        sampleState: Object.values(statesData)[0],
        lgasType: typeof lgasData,
        lgasCount: Object.keys(lgasData).length,
        lgasKeys: Object.keys(lgasData).slice(0, 5),
        sampleLGA: Object.values(lgasData)[0]
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = NigeriaLocations;