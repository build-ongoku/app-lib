import React from 'react';
/**
 * A simple button component from app-lib-v2
 */
export var Button = function (_a) {
    var text = _a.text, onClick = _a.onClick;
    return (React.createElement("button", { onClick: onClick, style: {
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        } }, text));
};
