const fakeData = require('./faker');

/**
 * batch job
 *
 * @param config {Object} config
 * @param api {Object} ws api
 * @param root {Object} root
 */

function job(config, api, root) {
    const txs = [];
    Object.keys(config.call).map(function (module, _index) {
        const func_body = config.call[module];
        Object.keys(func_body).map(function (func, _index) {
            const params = func_body[func].params;
            const size = func_body[func].size;

            for (let i = 0; i < size; i++) {
                const data = fakeData(config.meta.datatype, params);
                txs.push(api.tx.sudo.sudo(api.tx[module][func](...Object.values(data))))
            }

        });
    });

    return new Promise(function (resolve, reject) {
        api.tx.utility.batch(txs).signAndSend(root, {nonce: -1}, (result) => {
            if (result.status.isFinalized) {
                const {success, error} = _extractEvents(api, result);
                if (error) {
                    console.log("error:", error);
                }
                console.log("Done! exit manually please");
                resolve("ok")
            }
        });
    });
}

/**
 * extractEvents
 *
 * @param api {Object} api
 * @param result {Object} result
 */
function _extractEvents(api, result) {
    if (!result || !result.events) {
        return;
    }
    let success = false;
    let error;
    result.events
        .filter((event) => !!event.event)
        .map(({event: {data, method, section}}) => {
            console.log('\t', ` ${section}.${method}`, data.toString());
            if (section === "system" && method === "ExtrinsicFailed") {
                const [dispatchError] = data;
                let message = dispatchError.type;

                if (dispatchError.isModule) {
                    try {
                        const mod = dispatchError.asModule;
                        const error = api.registry.findMetaError(
                            new Uint8Array([mod.index.toNumber(), mod.error.toNumber()])
                        );

                        message = `${error.section}.${error.name}`;
                    } catch (error) {
                        // swallow error
                    }
                }
                error = message;
            } else {
                if (section === "system" && method === "ExtrinsicSuccess") {
                    success = true;
                }
            }
        });
    return {success, error};
}

module.exports = job;
