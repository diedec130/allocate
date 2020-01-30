define(function () {

    const saleOrders = [{

        'id': 'S1',

        'created': '2020-01-02',

        'quantity': 6

    }, {

        'id': 'S2',

        'created': '2020-11-05',

        'quantity': 2

    }, {

        'id': 'S3',

        'created': '2019-12-04',

        'quantity': 3

    }, {

        'id': 'S4',

        'created': '2020-01-20',

        'quantity': 2

    }, {

        'id': 'S5',

        'created': '2019-12-15',

        'quantity': 9

    }];

    const purchaseOrders = [{

        'id': 'P1',

        'receiving': '2020-01-04',

        'quantity': 4

    }, {

        'id': 'P2',

        'receiving': '2020-01-05',

        'quantity': 3

    }, {

        'id': 'P3',

        'receiving': '2020-02-01',

        'quantity': 5

    }, {

        'id': 'P4',

        'receiving': '2020-03-05',

        'quantity': 1

    }, {

        'id': 'P5',

        'receiving': '2020-02-20',

        'quantity': 7

    }];

    return {
        getSaleOrders: () => saleOrders,
        getPurchaseOrders: () => purchaseOrders
    };
});
