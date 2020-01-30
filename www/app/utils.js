define(function () {
    return {
        ascendingDateComparison: (order1, order2) => order1.date - order2.date,

        injectDate: (collection, dateFieldName) => collection.map(element => {
            return { ...element, date: new Date(element[dateFieldName]) };
        }),

        renderResult: (result) => {
            console.log(result);

            const markup =
                `<table>
                    <thead>
                    <tr>
                        <th>Order Id</th>
                        <th>Expected Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${result.map(order => `<tr><td>${order.id}</td><td>${order.expectedDate}</td></tr>`)}
                    </tbody>
                </table>`;
                
            document.getElementById('content').innerHTML = markup;
        }
    };
});