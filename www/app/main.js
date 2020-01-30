define(function (require) {

    const utils = require('./utils'),
        service = require('./service');

    /*
    * allocatedOrderGenerator: Generator function for allocated orders.
    * Keeps memory of previous iterations regarding leftovers in purchase stockings.
    * @params: salesOrders array of sorted orders, purchaseOrders array of sorted orders.
    * @returns: next allocated order
    */
    function* allocatedOrderGenerator(salesOrders, purchaseOrders) {
        let nextPossibleDate,
            salesIndex = 0,
            purchaseIndex = 0,
            leftOver = 0;

        while (salesIndex < salesOrders.length) {

            /*If there are no more purchase orders left to supply 
            the remaining sales orders, yield a pending allocated order */
            if (purchaseIndex == purchaseOrders.length) {
                yield {
                    id: salesOrders[salesIndex].id,
                    expectedDate: 'Pending'
                };
                salesIndex++;
            }
            else {
                let currentSalesOrder = salesOrders[salesIndex],
                    currentPurchaseOrder = purchaseOrders[purchaseIndex];

                //Update current purchase order stockings with last purchase order's lefover
                currentPurchaseOrder.quantity += leftOver;

                //Next possible date for allocated order 
                nextPossibleDate = currentSalesOrder.date < currentPurchaseOrder.date ? currentPurchaseOrder.receiving : currentSalesOrder.created;

                /*If there are enough stockings to supply current sales order, 
                yield an allocated order and continue with the next one*/
                if (currentSalesOrder.quantity <= currentPurchaseOrder.quantity) {
                    yield {
                        id: currentSalesOrder.id,
                        expectedDate: nextPossibleDate
                    };

                    currentPurchaseOrder.quantity -= currentSalesOrder.quantity;

                    leftOver = 0;

                    salesIndex++;

                    if (!currentPurchaseOrder.quantity) {
                        purchaseIndex++;
                    }
                }
                /*Otherwise, yield nothing and continue iterating with the same sales order
                but over the next purchase order, considering the current's leftover */
                else {
                    yield;
                    leftOver = currentPurchaseOrder.quantity;
                    purchaseIndex++;
                }
            }
        }
    };

    /*
    * allocate: Allocates sales orders according to a supply product provided by purchase orders.
    * Premise: FIFO approach. First sale orders that arrive are the ones that get allocated first.
    * Product resources are reserved for the current sales order until it can be fullfilled and dispatched.
    * @params: salesOrders array of unordered orders, purchaseOrders array of unordered orders.
    * @returns: allocated orders array
    */
    function allocate(salesOrders, purchaseOrders) {

        //Inject a functional Date property in both order arrays, for sorting purposes
        let result = [],
            salesOrdersToProcess = utils.injectDate(salesOrders, 'created'),
            purchaseOrdersToProcess = utils.injectDate(purchaseOrders, 'receiving');


        //Sort both order arrays by ascending Date
        salesOrdersToProcess.sort(utils.ascendingDateComparison);
        purchaseOrdersToProcess.sort(utils.ascendingDateComparison);

        //Create instance of generator function that yields allocated orders
        const allocatedOrders = allocatedOrderGenerator(salesOrdersToProcess, purchaseOrdersToProcess);

        /*Iterate over the allocated orders yielded by the generator function.
          Insert only valid allocated orders in the result array*/
        for (order of allocatedOrders) {
            if (order) {
                result.push(order);
            }
        }

        //Return the allocated orders
        return result;
    };

    const result = allocate(service.getSaleOrders(), service.getPurchaseOrders());

    utils.renderResult(result);
});
