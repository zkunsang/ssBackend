class RuntimeError extends Error {
    constructor(errorType, {name, code, message}) {
        super(name);
        this.errorType = errorType;
        this.name = name;
        this.code = code;
        this.message = message;

        this.errorIndex = null;
        this.errorDate = null;

        this.isHandled = false;
        this.additionalMessage = null;
    }

    makeErrorMessage() {
        const message = [];
        if(this.errorIndex) message.push(`ErrIndex: ${this.errorIndex}`);
        if(this.errorDate) message.push(`ErrDate: ${this.errorDate}`);
        if(this.errorType) message.push(`ErrType: ${this.errorType}`);
        if(this.message) message.push(`Msg: ${this.message}`);
        if(this.additionalMessage) message.push(`AddMsg: ${this.additionalMessage}`);
        if(this.stack) message.push(`Stack: ${this.stack}`);

        return message.join('\n');
    }

    setLogIndex(errorIndex) { this.errorIndex = errorIndex; }
    setLogDate(errorDate) { this.errorDate = errorDate; }

    setHandled() { this.isHandled = true; }
    getHandled() { return this.isHandled; }
}

module.exports = RuntimeError;