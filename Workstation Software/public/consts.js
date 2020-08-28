module.exports = Object.freeze({
    // Navigation pages
    PAGE_SYSTEM_VIEW_TREE : "SystemViewTree",
    PAGE_SYSTEM_VIEW_LIST : "SystemViewList",
    PAGE_HISTORY: "History",
    PAGE_HOMEPAGE: "Homepage",
    PAGE_PLANNER: "Planner",
    PAGE_SETTINGS: "Settings",
    // COM Port
    COM_PORT : "COM5",
    // Operation Code
    GET_CONFIGURATION : 1,
    SET_CONFIGURATION : 2,
    GET_SENSORDATA : 3,
    SET_ACTUATORDATA : 4,
    // Request Protocol Format
    PACKAGE_LENGTH_OFFSET : 0,
    OPCODE_OFFSET : 1,
    ADDRESS_LENGTH_OFFSET : 2,
    ADDRESS_OFFSET : 3,
    // Response Protocol Format
    COMPLETECODE_OFFSET : 1,
    DATA_LENGTH_OFFSET : 2,
    DATA_OFFSET : 3,    
    // Buffer Size
    SERIAL_BUFFER_SIZE: 32,
    // Operation Completion Code
    SUCCESS : 0
})

