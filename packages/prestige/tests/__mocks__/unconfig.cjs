let mockResult = {
  config: {},
  sources: [],
};

const loadConfig = async () => {
  return mockResult;
};

// Helper for tests to set the config
const __setMockResult = (result) => {
  mockResult = result;
};

// Also support setting just config
const __setMockConfig = (config) => {
  mockResult = {
    ...mockResult,
    config,
  };
};

module.exports = {
  loadConfig,
  __setMockResult,
  __setMockConfig,
};
