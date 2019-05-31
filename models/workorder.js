module.exports = function(sequelize, DataTypes) {
    var WorkOrders = sequelize.define("WorkOrders", {
        priority: {
            type: DataTypes.STRING,
        },
        task: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.STRING
        },
        issued: {
            type: DataTypes.DATE,
        },
        due: {
            type: DataTypes.DATE
        },
        completed: {
            type: DataTypes.DATE,
        },
        timeBetween: {
            type: DataTypes.INTEGER
        }
    });
  
    WorkOrders.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      WorkOrders.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return WorkOrders;
  };