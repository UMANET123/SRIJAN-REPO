const sequelize = require("./orm.database");
const { DATE, STRING, INTEGER, NOW, Op } = require("sequelize");

const SubscriberDataMask = sequelize.define(
  "subscriber_data_mask",
  {
    uuid: {
      type: STRING
    },
    phone_no: {
      type: STRING
    },
    status: {
      type: INTEGER
    },
    created: {
      type: DATE
    }
  },
  {
    freezeTableName: true,
    tableName: "subscriber_data_mask",
    timestamps: false
  }
);

const SubscriberOTP = sequelize.define(
  "subscriber_otps",
  {
    uuid: {
      type: STRING
    },
    app_id: {
      type: STRING
    },
    developer_id: {
      type: STRING
    },
    otp: {
      type: STRING
    },
    expiration: {
      type: DATE
    },
    status: {
      type: INTEGER
    }
  },
  {
    freezeTableName: true,
    tableName: "subscriber_otps",
    timestamps: false
  }
);

const FloodControl = sequelize.define(
  "flood_control",
  {
    uuid: {
      type: STRING
    },
    app_id: {
      type: STRING
    },
    created_at: {
      type: DATE,
      defaultValue: NOW()
    },
    status: {
      type: INTEGER,
      defaultValue: 0
    },
    retry: {
      type: INTEGER,
      defaultValue: 0
    }
  },
  {
    freezeTableName: true,
    tableName: "flood_control",
    timestamps: false
  }
);

const TransactionData = sequelize.define(
  "transaction_data",
  {
    transaction_id: { type: STRING },
    uuid: { type: STRING },
    app_id: { type: STRING },
    created: { type: DATE },
    status: { type: STRING }
  },
  {
    freezeTableName: true,
    tableName: "transaction_data",
    timestamps: false
  }
);

module.exports = { SubscriberDataMask, SubscriberOTP, FloodControl, TransactionData, Op };
