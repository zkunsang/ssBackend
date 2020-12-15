const DataTable = require("../models/mongo/DataTable");
const Dao = require('./Dao');

class DataTableDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('datatable');
    }

    static model = DataTable;

    static requireInsertFieldList() {
        return [
            DataTable.Schema.TABLE_ID.key,
            DataTable.Schema.VERSION.key,
            DataTable.Schema.CRC32.key,
            DataTable.Schema.UPDATE_DATE.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            DataTable.Schema.VERSION.key,
            DataTable.Schema.CRC32.key,
            DataTable.Schema.UPDATE_DATE.key
        ]
    };

    static notAllowSetFieldList() {
        return []
    };
}

module.exports = DataTableDao;