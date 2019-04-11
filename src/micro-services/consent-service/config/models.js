/* jshint esversion:6 */
const sequelize = require("./orm.database");
const { DATE, STRING, INTEGER, NOW, JSON, TEXT, Op } = require("sequelize");

const SubscriberConsent = sequelize.define(
  "subscriber_consent",
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
    scopes: {
      type: JSON
    },
    access_token: {
      type: TEXT
    },
    status: {
      type: INTEGER
    },
    created: {
      type: DATE
    },
    updated: {
      type: DATE
    },
    consent_expiry: {
      type: STRING
    },
    consent_type: {
      type: STRING
    }
  },
  {
    freezeTableName: true,
    tableName: "subscriber_consent",
    timestamps: false
  }
);

const SubscriberBlacklistApp = sequelize.define(
  "subscriber_blacklist_apps",
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
    blacklist_status: {
      type: INTEGER
    },
    created: {
      type: DATE
    },
    updated: {
      type: DATE
    },
    status: {
      type: INTEGER
    }
  },
  {
    freezeTableName: true,
    tableName: "subscriber_blacklist_apps",
    timestamps: false
  }
);

const AppMetaData = sequelize.define(
  "apps_metadata",
  {
    app_id: {
      type: STRING
    },
    developer_id: {
      type: STRING
    },
    appname: {
      type: STRING
    },
    short_description: {
      type: TEXT
    },
    long_description: {
      type: TEXT
    },
    developer_name: {
      type: STRING
    },
    created: {
      type: DATE
    },
    updated: {
      type: DATE
    }
  },
  {
    freezeTableName: true,
    tableName: "apps_metadata",
    timestamps: false
  }
);

module.exports = {
  SubscriberConsent,
  SubscriberBlacklistApp,
  AppMetaData,
  Op
};
