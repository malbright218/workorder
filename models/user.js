module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        shift: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    User.associate = function (models) {
        User.hasMany(models.WorkOrders);
    };

    return User;
};

