const loadConfigSetting = function(name, defValue) {
    let variable
    if(JSON.parse(localStorage.getItem(name)) === null) {
        variable = defValue
        localStorage.setItem(name,JSON.stringify(variable))
        return variable;
    }
    else {
        variable = JSON.parse(localStorage.getItem(name))
        return variable;
    }
}

export var configVariables = {
    comport: loadConfigSetting("comport", "COM5"),
    refreshTime: loadConfigSetting("refreshTime", 5000),
    maxLoadTime: loadConfigSetting("maxLoadTime", 300),
    acceptableLoad: loadConfigSetting("acceptableLoad", 0.75)
}
