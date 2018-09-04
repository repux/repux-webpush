export default {
    finaliseNotification: (productAddress: string, productTitle: string) => {
        return {
            data: {
                productAddress,
                type: 'finalise'
            },
            title: `Confirmed transaction`,
            msg: `Your file ${productTitle} is ready to download from RepuX.`,
            actions: [
                {
                    action: 'download',
                    title: 'Download'
                }
            ]
        };
    },
    purchaseNotification: (productAddress: string, productTitle: string) => {
        return {
            data: {
                productAddress,
                type: 'purchase'
            },
            title: `Confirmed transaction`,
            msg: `Your file ${productTitle} was just bought on RepuX. Click here to finalise it.`,
            actions: [
                {
                    action: 'finalise',
                    title: 'Finalise'
                }
            ]
        };
    }
}
