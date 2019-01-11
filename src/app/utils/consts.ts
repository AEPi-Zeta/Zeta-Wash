const DEFAULT_TAB = 0;

const DIALOG_CONFIGS = {
    PinInputDialog: {
        height: '400px',
        width: '600px'
    },
    ConfirmDialog: {
        height: '400px',
        width: '600px'
    },
    LogDialog: {
        height: '400px',
        width: '600px',
        data: {
            id: 22,
            title: 'Log'
        }
    },
    SettingsDialog: {
        width: '1200px',
        data: {
            id: 21,
            title: 'Settings'
        }
    },
    ModifyMachineDialog: {
        height: '400px',
        width: '600px'
    },
    ModifyMachinesDialog: {
        width: '1200px'
    }
};

/**
 * Function that takes in a relative path url as a string, changes one element, and returns the modified url
 * @param url relative path to change, e.g. /signup/settings
 * @param index which element to change within the relative path, indexes at 1. e.g. for /signup/settings, to change signup index is 1
 * @param newElement new string to replace the element described by index. empty string deletes that element
 */
function setURLElement(url: string, index: number, newElement: string): string {
    const urlComponents = url.split('/');
    if (urlComponents.length <= index) {
        if (newElement === null) {
            urlComponents.splice(index, 1);
        } else {
            if (urlComponents.length === index) {
            urlComponents.push(newElement);
            } else {
            console.error('ROUTING ERROR: Cannot add new URL element!');
            }
        }
    } else {
        if (newElement === null) {
            urlComponents.splice(index, 1);
        } else {
            urlComponents[index] = newElement;
        }
    }
    return urlComponents.join('/');
}

const consts = {
    DIALOG_CONFIGS,
    setURLElement
};

export default consts;
