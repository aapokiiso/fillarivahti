
module.exports = {
    up: async queryInterface => {
        await queryInterface.addIndex(
            'Capacities',
            [
                'station_id',
                'timestamp',
            ],
            {
                name: 'station_id_timestamp',
                using: 'BTREE',
            },
        );
    },
    down: async queryInterface => {
        await queryInterface.removeIndex(
            'Capacities',
            'station_id_timestamp',
        );
    },
};
