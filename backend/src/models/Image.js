module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        imageData: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        isPrimary: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        mimeType: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'recipe_images',
        timestamps: true
    });

    Image.associate = (models) => {
        Image.belongsTo(models.Recipe, {
            foreignKey: 'recipeId',
            onDelete: 'CASCADE'
        });
    };

    return Image;
};