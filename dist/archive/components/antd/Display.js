import { FieldDisplay } from '../DisplayAttributes';
import { getFieldForFieldKind } from './FieldAntd';
export var TypeDisplay = function (props) {
    var typeInfo = props.typeInfo, objectValue = props.objectValue;
    // Construct Description Items
    var filteredFields = typeInfo.fieldInfos;
    // - Remove Meta fields?
    if (!props.showMetaFields) {
        filteredFields = filteredFields.filter(function (fieldInfo) {
            return !fieldInfo.isMetaField;
        });
    }
    var descriptionsItems = filteredFields.map(function (fieldInfo) {
        var fieldKind = fieldInfo.kind;
        var fieldComponent = getFieldForFieldKind(fieldKind);
        var DisplayComponent = fieldComponent.getDisplayComponent(fieldInfo);
        if (fieldInfo.isRepeated) {
            DisplayComponent = fieldComponent.getDisplayRepeatedComponent(fieldInfo);
        }
        return (React.createElement("li", { key: fieldInfo.name },
            React.createElement(FieldDisplay, { fieldInfo: fieldInfo, objectValue: objectValue, DisplayComponent: DisplayComponent })));
    });
    // Return a Table view
    return React.createElement("div", null, descriptionsItems);
};
