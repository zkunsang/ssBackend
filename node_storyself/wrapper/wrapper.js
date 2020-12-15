class Wrapper {
    constructor() { }

    tryCatchWrapper(prototype, tryCatchFn) {
        let propertyList = Object.getOwnPropertyNames(prototype);

        for (const property of propertyList) {
            let oldFn = prototype[property];
            if (property !== 'constructor' && typeof (oldFn) === 'function') {
                prototype[property] = async function (...args) {
                    return await prototype.execute.call(this, oldFn, ...args);
                };
            }
        }

        prototype.execute = tryCatchFn
    }
}

module.exports = Wrapper;
