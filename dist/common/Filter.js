var Operator;
(function (Operator) {
    Operator["EQUAL"] = "EQUAL";
    Operator["NOT_EQUAL"] = "NOT_EQUAL";
    Operator["IN"] = "IN";
    Operator["GREATER_THAN"] = "GREATER_THAN";
    Operator["GREATER_THAN_EQUAL"] = "GREATER_THAN_EQUAL";
    Operator["LESS_THAN"] = "LESS_THAN";
    Operator["LESS_THAN_EQUAL"] = "LESS_THAN_EQUAL";
    Operator["LIKE"] = "LIKE";
    Operator["ILIKE"] = "ILIKE";
    Operator["NOT_LIKE"] = "NOT_LIKE";
    Operator["IS_NULL"] = "IS_NULL";
    Operator["IS_NOT_NULL"] = "IS_NOT_NULL";
})(Operator || (Operator = {}));

export { Operator };
