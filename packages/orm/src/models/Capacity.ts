import { DataTypes, Sequelize, Model, ModelCtor } from 'sequelize';

function importCapacityModel(sequelize: Sequelize): ModelCtor<Model> {
    return sequelize.define(
        'Capacity',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            stationId: {
                // eslint-disable-next-line new-cap, no-magic-numbers
                type: DataTypes.STRING(5),
                comment: 'HSL station ID',
            },
            timestamp: {
                type: DataTypes.DATE,
            },
            capacity: {
                // eslint-disable-next-line new-cap, no-magic-numbers
                type: DataTypes.DECIMAL(3, 2),
                comment: 'Capacity percentage',
            },
        },
        {
            timestamps: false,
            indexes: [
                {
                    name: 'station_id',
                    using: 'BTREE',
                    fields: [
                        'stationId',
                    ],
                },
            ],
        },
    );
}

export default importCapacityModel;
