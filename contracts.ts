 

export namespace W3 {
    declare type BigNumber = Object;

    export type address = string;
    export type bytes = string;

    /** Truffle Contract */
    export namespace TC {
        export interface TxParams {
            from: address;
            gas: number;
            gasPrice: number;
            value: number;
        }

        export type ContractDataType = BigNumber | number | string | boolean | BigNumber[] | number[] | string[];

        export interface TransactionResult {
            /** Transaction hash. */
            tx: string;
            receipt: TransactionReceipt;
            /** This array has decoded events, while reseipt.logs has raw logs when returned from TC transaction */
            logs: Log[];
        }

        export function txParamsDefaultDeploy(from: address): TxParams {
            return {
                from: from,
                gas: 4712388,
                gasPrice: 20000000000,
                value: 0
            };
        }

        export function txParamsDefaultSend(from: address): TxParams {
            return {
                from: from,
                gas: 50000,
                gasPrice: 20000000000,
                value: 0
            };
        }
    }

    // '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{see above}],"id":1}'
    export interface JsonRPCRequest {
        jsonrpc: string;
        method: string;
        params: any[];
        id: number | string;
    }
    export interface JsonRPCResponse {
        jsonrpc: string;
        id: number | string;
        result?: any;
        error?: string;
    }

    export interface Provider {
        sendAsync(
            payload: JsonRPCRequest,
            callback: (err: Error, result: JsonRPCResponse) => void,
        ): void;
    }

    // export interface Provider {
    //     send(payload: JsonRPCRequest, callback: (e: Error, val: JsonRPCResponse) => void);
    // }

    export interface WebsocketProvider extends Provider { }
    export interface HttpProvider extends Provider { }
    export interface IpcProvider extends Provider { }
    export interface Providers {
        WebsocketProvider: new (host: string, timeout?: number) => WebsocketProvider;
        HttpProvider: new (host: string, timeout?: number) => HttpProvider;
        IpcProvider: new (path: string, net: any) => IpcProvider;
    }

    // tslint:disable-next-line:max-line-length
    export type Unit = 'kwei' | 'femtoether' | 'babbage' | 'mwei' | 'picoether' | 'lovelace' | 'qwei' | 'nanoether' | 'shannon' | 'microether' | 'szabo' | 'nano' | 'micro' | 'milliether' | 'finney' | 'milli' | 'ether' | 'kether' | 'grand' | 'mether' | 'gether' | 'tether';

    export type BlockType = 'latest' | 'pending' | 'genesis' | number;

    export interface BatchRequest {
        add(request: Request): void;
        execute(): void;
    }
    export interface Iban { }
    export interface Utils {
        BN: BigNumber; // TODO only static-definition
        isBN(obj: any): boolean;
        isBigNumber(obj: any): boolean;
        isAddress(obj: any): boolean;
        isHex(obj: any): boolean;
        // tslint:disable-next-line:member-ordering
        asciiToHex(val: string): string;
        hexToAscii(val: string): string;
        bytesToHex(val: number[]): string;
        numberToHex(val: number | BigNumber): string;
        checkAddressChecksum(address: string): boolean;
        fromAscii(val: string): string;
        fromDecimal(val: string | number | BigNumber): string;
        fromUtf8(val: string): string;
        fromWei(val: string | number | BigNumber, unit: Unit): string | BigNumber;
        hexToBytes(val: string): number[];
        hexToNumber(val: string | number | BigNumber): number;
        hexToNumberString(val: string | number | BigNumber): string;
        hexToString(val: string): string;
        hexToUtf8(val: string): string;
        keccak256(val: string): string;
        leftPad(str: string, chars: number, sign: string): string;
        padLeft(str: string, chars: number, sign: string): string;
        rightPad(str: string, chars: number, sign: string): string;
        padRight(str: string, chars: number, sign: string): string;
        sha3(val: string, val2?: string, val3?: string, val4?: string, val5?: string): string;
        soliditySha3(val: string): string;
        randomHex(bytes: number): string;
        stringToHex(val: string): string;
        toAscii(hex: string): string;
        toBN(obj: any): BigNumber;
        toChecksumAddress(val: string): string;
        toDecimal(val: any): number;
        toHex(val: any): string;
        toUtf8(val: any): string;
        toWei(val: string | number | BigNumber, unit: Unit): string | BigNumber;
        // tslint:disable-next-line:member-ordering
        unitMap: any;
    }
    export type Callback<T> = (error: Error, result: T) => void;
    export type ABIDataTypes = 'uint256' | 'boolean' | 'string' | 'bytes' | string; // TODO complete list

    export interface ABIDefinition {
        constant?: boolean;
        payable?: boolean;
        anonymous?: boolean;
        inputs?: Array<{ name: string, type: ABIDataTypes, indexed?: boolean }>;
        name?: string;
        outputs?: Array<{ name: string, type: ABIDataTypes }>;
        type: 'function' | 'constructor' | 'event' | 'fallback';
    }

    export interface CompileResult {
        code: string;
        info: {
            source: string;
            language: string;
            languageVersion: string;
            compilerVersion: string;
            abiDefinition: Array<ABIDefinition>;
        };
        userDoc: { methods: object };
        developerDoc: { methods: object };
    }

    export interface Transaction {
        hash: string;
        nonce: number;
        blockHash: string;
        blockNumber: number;
        transactionIndex: number;
        from: string;
        to: string;
        value: string;
        gasPrice: string;
        gas: number;
        input: string;
        v?: string;
        r?: string;
        s?: string;
    }
    export interface EventLog {
        event: string;
        address: string;
        returnValues: object;
        logIndex: number;
        transactionIndex: number;
        transactionHash: string;
        blockHash: string;
        blockNumber: number;
        raw?: { data: string, topics: any[] };
    }

    export interface TransactionReceipt {
        transactionHash: string;
        transactionIndex: number;
        blockHash: string;
        blockNumber: number;
        from: string;
        to: string;
        contractAddress: string;
        cumulativeGasUsed: number;
        gasUsed: number;
        logs?: Log[];
        events?: {
            [eventName: string]: EventLog
        };
    }
    export interface BlockHeader {
        number: number;
        hash: string;
        parentHash: string;
        nonce: string;
        sha3Uncles: string;
        logsBloom: string;
        transactionRoot: string;
        stateRoot: string;
        receiptRoot: string;
        miner: string;
        extraData: string;
        gasLimit: number;
        gasUsed: number;
        timestamp: number;
    }
    export interface Block extends BlockHeader {
        transactions: Array<Transaction>;
        size: number;
        difficulty: number;
        totalDifficulty: number;
        uncles: Array<string>;
    }

    export interface Logs {
        fromBlock?: number;
        address?: string;
        topics?: Array<string | string[]>;

    }

    /**  */
    export interface Log {
        /** true when the log was removed, due to a chain reorganization. false if its a valid log. */
        removed?: boolean;
        logIndex: number;
        transactionIndex: number;
        transactionHash: string;
        blockHash: string;
        blockNumber: number;
        address: string;
        data?: string;
        topics?: Array<string>;

        /** Truffle-contract returns this as 'mined' */
        type?: string;

        /** Event name decoded by Truffle-contract */
        event?: string;
        /** Args passed to a Truffle-contract method */
        args?: any;
    }

    export interface Subscribe<T> {
        subscription: {
            id: string;
            subscribe(callback?: Callback<Subscribe<T>>): Subscribe<T>;
            unsubscribe(callback?: Callback<boolean>): void | boolean;
            // tslint:disable-next-line:member-ordering
            arguments: object;
        };
        /*  on(type: "data" , handler:(data:Transaction)=>void): void
          on(type: "changed" , handler:(data:Logs)=>void): void
          on(type: "error" , handler:(data:Error)=>void): void
          on(type: "block" , handler:(data:BlockHeader)=>void): void
          */
        on(type: 'data', handler: (data: T) => void): void;
        on(type: 'changed', handler: (data: T) => void): void;
        on(type: 'error', handler: (data: Error) => void): void;
    }

    export interface Account {
        address: string;
        privateKey: string;
        publicKey: string;

    }

    export interface PrivateKey {
        address: string;
        Crypto: {
            cipher: string,
            ciphertext: string,
            cipherparams: {
                iv: string
            },
            kdf: string,
            kdfparams: {
                dklen: number,
                n: number,
                p: number,
                r: number,
                salt: string
            },
            mac: string
        };
        id: string;
        version: number;
    }

    export interface Signature {
        message: string;
        hash: string;
        r: string;
        s: string;
        v: string;
    }
    export interface Tx {
        nonce?: string | number;
        chainId?: string | number;
        from?: string;
        to?: string;
        data?: string;
        value?: string | number;
        gas?: string | number;
        gasPrice?: string | number;
    }

    export interface ContractOptions {
        address: string;
        jsonInterface: ABIDefinition[];
        from?: string;
        gas?: string | number | BigNumber;
        gasPrice?: number;
        data?: string;
    }

    export type PromiEventType = 'transactionHash' | 'receipt' | 'confirmation' | 'error';
    export interface PromiEvent<T> extends Promise<T> {
        once(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;
        once(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;
        once(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;
        once(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
        // tslint:disable-next-line:max-line-length
        once(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash', handler: (error: Error | TransactionReceipt | string) => void): PromiEvent<T>;
        on(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;
        on(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;
        on(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;
        on(type: 'error', handler: (error: Error) => void): PromiEvent<T>;
        // tslint:disable-next-line:max-line-length
        on(type: 'error' | 'confirmation' | 'receipt' | 'transactionHash', handler: (error: Error | TransactionReceipt | string) => void): PromiEvent<T>;
    }
    export interface EventEmitter {
        on(type: 'data', handler: (event: EventLog) => void): EventEmitter;
        on(type: 'changed', handler: (receipt: EventLog) => void): EventEmitter;
        on(type: 'error', handler: (error: Error) => void): EventEmitter;
        // tslint:disable-next-line:max-line-length
        on(type: 'error' | 'data' | 'changed', handler: (error: Error | TransactionReceipt | string) => void): EventEmitter;
    }

    export interface TransactionObject<T> {
        arguments: any[];
        call(tx?: Tx): Promise<T>;
        send(tx?: Tx): PromiEvent<T>;
        estimateGas(tx?: Tx): Promise<number>;
        encodeABI(): string;
    }

    export interface Contract {
        options: ContractOptions;
        methods: {
            [fnName: string]: (...args: any[]) => TransactionObject<any>
        };
        deploy(options: {
            data: string
            arguments: any[]
        }): TransactionObject<Contract>;
        // tslint:disable-next-line:member-ordering
        events: {
            [eventName: string]: (options?: {
                filter?: object
                fromBlock?: BlockType
                topics?: any[]
            }, cb?: Callback<EventLog>) => EventEmitter
            // tslint:disable-next-line:max-line-length
            allEvents: (options?: { filter?: object, fromBlock?: BlockType, topics?: any[] }, cb?: Callback<EventLog>) => EventEmitter
        };

    }

    export interface Eth {
        readonly defaultAccount: string;
        readonly defaultBlock: BlockType;
        BatchRequest: new () => BatchRequest;
        Iban: new (address: string) => Iban;
        Contract: new (jsonInterface: any[], address?: string, options?: {
            from?: string
            gas?: string | number | BigNumber
            gasPrice?: number
            data?: string
        }) => Contract;
        abi: {
            decodeLog(inputs: object, hexString: string, topics: string[]): object
            encodeParameter(type: string, parameter: any): string
            encodeParameters(types: string[], paramaters: any[]): string
            encodeEventSignature(name: string | object): string
            encodeFunctionCall(jsonInterface: object, parameters: any[]): string
            encodeFunctionSignature(name: string | object): string
            decodeParameter(type: string, hex: string): any
            decodeParameters(types: string[], hex: string): any
        };
        accounts: {
            'new'(entropy?: string): Account
            privateToAccount(privKey: string): Account
            publicToAddress(key: string): string
            // tslint:disable-next-line:max-line-length
            signTransaction(tx: Tx, privateKey: string, returnSignature?: boolean, cb?: (err: Error, result: string | Signature) => void): Promise<string> | Signature;
            recoverTransaction(signature: string | Signature): string
            sign(data: string, privateKey: string, returnSignature?: boolean): string | Signature
            recover(signature: string | Signature): string
            encrypt(privateKey: string, password: string): PrivateKey
            decrypt(privateKey: PrivateKey, password: string): Account
            // tslint:disable-next-line:member-ordering
            wallet: {
                'new'(numberOfAccounts: number, entropy: string): Account[]
                add(account: string | Account): any
                remove(account: string | number): any
                save(password: string, keyname?: string): string
                load(password: string, keyname: string): any
                clear(): any
            }
        };
        call(callObject: Tx, defaultBloc?: BlockType, callBack?: Callback<string>): Promise<string>;
        clearSubscriptions(): boolean;
        subscribe(type: 'logs', options?: Logs, callback?: Callback<Subscribe<Log>>): Promise<Subscribe<Log>>;
        subscribe(type: 'syncing', callback?: Callback<Subscribe<any>>): Promise<Subscribe<any>>;
        // tslint:disable-next-line:max-line-length
        subscribe(type: 'newBlockHeaders', callback?: Callback<Subscribe<BlockHeader>>): Promise<Subscribe<BlockHeader>>;
        subscribe(type: 'pendingTransactions', callback?: Callback<Subscribe<Transaction>>): Promise<Subscribe<Transaction>>;
        // tslint:disable-next-line:max-line-length
        subscribe(type: 'pendingTransactions' | 'newBlockHeaders' | 'syncing' | 'logs', options?: Logs, callback?: Callback<Subscribe<Transaction | BlockHeader | any>>): Promise<Subscribe<Transaction | BlockHeader | any>>;

        unsubscribe(callBack: Callback<boolean>): void | boolean;
        // tslint:disable-next-line:member-ordering
        compile: {
            solidity(source: string, callback?: Callback<CompileResult>): Promise<CompileResult>;
            lll(source: string, callback?: Callback<CompileResult>): Promise<CompileResult>;
            serpent(source: string, callback?: Callback<CompileResult>): Promise<CompileResult>;
        };
        // tslint:disable-next-line:member-ordering
        currentProvider: Provider;
        estimateGas(tx: Tx, callback?: Callback<number>): Promise<number>;
        getAccounts(cb?: Callback<Array<string>>): Promise<Array<string>>;
        getBalance(address: string, defaultBlock?: BlockType, cb?: Callback<number>): Promise<number>;
        // tslint:disable-next-line:variable-name
        getBlock(number: BlockType, returnTransactionObjects?: boolean, cb?: Callback<Block>): Promise<Block>;
        getBlockNumber(callback?: Callback<number>): Promise<number>;
        // tslint:disable-next-line:variable-name
        getBlockTransactionCount(number: BlockType | string, cb?: Callback<number>): Promise<number>;
        // tslint:disable-next-line:variable-name
        getBlockUncleCount(number: BlockType | string, cb?: Callback<number>): Promise<number>;
        getCode(address: string, defaultBlock?: BlockType, cb?: Callback<string>): Promise<string>;
        getCoinbase(cb?: Callback<string>): Promise<string>;
        getCompilers(cb?: Callback<string[]>): Promise<string[]>;
        getGasPrice(cb?: Callback<number>): Promise<number>;
        getHashrate(cb?: Callback<number>): Promise<number>;
        getPastLogs(options: {
            fromBlock?: BlockType
            toBlock?: BlockType
            address: string
            topics?: Array<string | Array<string>>
        }, cb?: Callback<Array<Log>>): Promise<Array<Log>>;
        getProtocolVersion(cb?: Callback<string>): Promise<string>;
        getStorageAt(address: string, defaultBlock?: BlockType, cb?: Callback<string>): Promise<string>;
        getTransactionReceipt(hash: string, cb?: Callback<TransactionReceipt>): Promise<TransactionReceipt>;
        getTransaction(hash: string, cb?: Callback<Transaction>): Promise<Transaction>;
        getTransactionCount(address: string, defaultBlock?: BlockType, cb?: Callback<number>): Promise<number>;
        getTransactionFromBlock(block: BlockType, index: number, cb?: Callback<Transaction>): Promise<Transaction>;
        // tslint:disable-next-line:max-line-length
        getUncle(blockHashOrBlockNumber: BlockType | string, uncleIndex: number, returnTransactionObjects?: boolean, cb?: Callback<Block>): Promise<Block>;
        getWork(cb?: Callback<Array<string>>): Promise<Array<string>>;
        // tslint:disable-next-line:member-ordering
        givenProvider: Provider;
        isMining(cb?: Callback<boolean>): Promise<boolean>;
        isSyncing(cb?: Callback<boolean>): Promise<boolean>;
        // tslint:disable-next-line:member-ordering
        net: Net;
        // tslint:disable-next-line:member-ordering
        sendSignedTransaction(data: string, cb?: Callback<string>): PromiEvent<TransactionReceipt>;
        sendTransaction(tx: Tx, cb?: Callback<string>): PromiEvent<TransactionReceipt>;
        submitWork(nonce: string, powHash: string, digest: string, cb?: Callback<boolean>): Promise<boolean>;
        sign(address: string, dataToSign: string, cb?: Callback<string>): Promise<string>;
    }

    export interface SyncingState {
        startingBlock: number;
        currentBlock: number;
        highestBlock: number;
    }

    export type SyncingResult = false | SyncingState;

    export interface Version0 {
        api: string;
        network: string;
        node: string;
        ethereum: string;
        whisper: string;
        getNetwork(callback: (err: Error, networkId: string) => void): void;
        getNode(callback: (err: Error, nodeVersion: string) => void): void;
        getEthereum(callback: (err: Error, ethereum: string) => void): void;
        getWhisper(callback: (err: Error, whisper: string) => void): void;
    }
    export interface Net { }

    export interface Shh { }

    export interface Bzz { }

    export const duration = {
        seconds: function (val: number) { return val; },
        minutes: function (val: number) { return val * this.seconds(60); },
        hours: function (val: number) { return val * this.minutes(60); },
        days: function (val: number) { return val * this.hours(24); },
        weeks: function (val: number) { return val * this.days(7); },
        years: function (val: number) { return val * this.days(365); }
    };
}

const contract = require('truffle-contract');
const web3 = window['web3'];

export abstract class StaticWeb3Contract {
    private contract: any;
    protected web3 = web3;

    private _instance: Promise<any>;

    constructor(contractAbi: any) {
        this.contract = contract(contractAbi);
    }

    protected init() {
        this.contract.setProvider(web3.currentProvider);
    }

    protected _getInstance(): Promise<any> {
        this.init();
        if (!this._instance) {
            this._instance = this.contract.deployed();
        }
        return this._instance;
    }

    public async $getBalance(id: string) {
        return await new Promise((resolve, reject) => {
            this.web3.eth.getBalance(id, (error: Error, result: string) => {
                if (error) {
                    reject(error);
                }

                resolve(this.divideByQuintillion(Number(result)));
            });
        });
    }

    private divideByQuintillion(num: number) {
        return num / 1000 / 1000 / 1000 / 1000 / 1000 / 1000;
    }
}

export abstract class Web3Contract {
    private contract: any;
    protected web3 = web3;

    private _instance: Promise<any>;

    constructor(private at: string, contractAbi: string) {
        this.contract = contract(contractAbi);
    }

    protected init() {
        this.contract.setProvider(web3.currentProvider);
    }

    protected _getInstance(): Promise<any> {
        this.init();
        if (!this._instance) {
            this._instance = this.contract.at(this.at);
        }
        return this._instance;
    }

    public async $getBalance() {
        return await new Promise((resolve, reject) => {
            this.web3.eth.getBalance(this.at, (error: Error, result: string) => {
                if (error) {
                    reject(error);
                }

                resolve(this.divideByQuintillion(Number(result)));
            });
        });
    }

    private divideByQuintillion(num: number) {
        return num / 1000 / 1000 / 1000 / 1000 / 1000 / 1000;
    }
}

            export class CappedCrowdsale extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"CappedCrowdsale","networks":{},"abi":[{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_cap","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"},{"constant":true,"inputs":[],"name":"capReached","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]})    
                }
        

            

            public async rate(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.rate.call({ from: params.options.from })
            }
        
            private _rateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.rate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get rateEvent() {
                return this._rateWatcher;
            }
        

            

            public async cap(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.cap.call({ from: params.options.from })
            }
        
            private _capWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.cap('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get capEvent() {
                return this._capWatcher;
            }
        

            

            public async weiRaised(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.weiRaised.call({ from: params.options.from })
            }
        
            private _weiRaisedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.weiRaised('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get weiRaisedEvent() {
                return this._weiRaisedWatcher;
            }
        

            

            public async wallet(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.wallet.call({ from: params.options.from })
            }
        
            private _walletWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.wallet('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get walletEvent() {
                return this._walletWatcher;
            }
        

            

            public async buyTokens(params: {_beneficiary: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.buyTokens(params._beneficiary, { from: params.options.from })
            }
        
            private _buyTokensWatcher = {
                watch: async (cb: (args: {_beneficiary: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.buyTokens('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get buyTokensEvent() {
                return this._buyTokensWatcher;
            }
        

            

            public async token(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.token.call({ from: params.options.from })
            }
        
            private _tokenWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.token('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get tokenEvent() {
                return this._tokenWatcher;
            }
        
            private _TokenPurchaseWatcher = {
                watch: async (cb: (args: {purchaser: string;beneficiary: string;value: string;amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.TokenPurchase('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TokenPurchaseEvent() {
                return this._TokenPurchaseWatcher;
            }
        

            

            public async capReached(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.capReached.call({ from: params.options.from })
            }
        
            private _capReachedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.capReached('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get capReachedEvent() {
                return this._capReachedWatcher;
            }
        }
            export class ConditionalEscrow extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"ConditionalEscrow","networks":{},"abi":[{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"depositsOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_payee","type":"address"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"payee","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"payee","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"withdrawalAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_payee","type":"address"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async depositsOf(params: {_payee: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.depositsOf.call(params._payee, { from: params.options.from })
            }
        
            private _depositsOfWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.depositsOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get depositsOfEvent() {
                return this._depositsOfWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        

            

            public async deposit(params: {_payee: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.deposit(params._payee, { from: params.options.from })
            }
        
            private _depositWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.deposit('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get depositEvent() {
                return this._depositWatcher;
            }
        
            private _DepositedWatcher = {
                watch: async (cb: (args: {payee: string;weiAmount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Deposited('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get DepositedEvent() {
                return this._DepositedWatcher;
            }
        
            private _WithdrawnWatcher = {
                watch: async (cb: (args: {payee: string;weiAmount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Withdrawn('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get WithdrawnEvent() {
                return this._WithdrawnWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        

            

            public async withdrawalAllowed(params: {_payee: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.withdrawalAllowed.call(params._payee, { from: params.options.from })
            }
        
            private _withdrawalAllowedWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.withdrawalAllowed('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get withdrawalAllowedEvent() {
                return this._withdrawalAllowedWatcher;
            }
        

            

            public async withdraw(params: {_payee: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.withdraw(params._payee, { from: params.options.from })
            }
        
            private _withdrawWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.withdraw('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get withdrawEvent() {
                return this._withdrawWatcher;
            }
        }
            export class ERC20 extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"ERC20","networks":{},"abi":[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async totalSupply(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.totalSupply.call({ from: params.options.from })
            }
        
            private _totalSupplyWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.totalSupply('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get totalSupplyEvent() {
                return this._totalSupplyWatcher;
            }
        

            

            public async balanceOf(params: {_who: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.balanceOf.call(params._who, { from: params.options.from })
            }
        
            private _balanceOfWatcher = {
                watch: async (cb: (args: {_who: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.balanceOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get balanceOfEvent() {
                return this._balanceOfWatcher;
            }
        

            

            public async transfer(params: {_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transfer(params._to, params._value, { from: params.options.from })
            }
        
            private _transferWatcher = {
                watch: async (cb: (args: {_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferEvent() {
                return this._transferWatcher;
            }
        
            private _ApprovalWatcher = {
                watch: async (cb: (args: {owner: string;spender: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Approval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ApprovalEvent() {
                return this._ApprovalWatcher;
            }
        
            private _TransferWatcher = {
                watch: async (cb: (args: {from: string;to: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TransferEvent() {
                return this._TransferWatcher;
            }
        

            

            public async allowance(params: {_owner: string;
_spender: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.allowance.call(params._owner, params._spender, { from: params.options.from })
            }
        
            private _allowanceWatcher = {
                watch: async (cb: (args: {_owner: string;_spender: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.allowance('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get allowanceEvent() {
                return this._allowanceWatcher;
            }
        

            

            public async transferFrom(params: {_from: string;
_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transferFrom(params._from, params._to, params._value, { from: params.options.from })
            }
        
            private _transferFromWatcher = {
                watch: async (cb: (args: {_from: string;_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferFrom('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferFromEvent() {
                return this._transferFromWatcher;
            }
        

            

            public async approve(params: {_spender: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.approve(params._spender, params._value, { from: params.options.from })
            }
        
            private _approveWatcher = {
                watch: async (cb: (args: {_spender: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.approve('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get approveEvent() {
                return this._approveWatcher;
            }
        }
            export class BasicToken extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"BasicToken","networks":{},"abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]})    
                }
        
            private _TransferWatcher = {
                watch: async (cb: (args: {from: string;to: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TransferEvent() {
                return this._TransferWatcher;
            }
        

            

            public async totalSupply(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.totalSupply.call({ from: params.options.from })
            }
        
            private _totalSupplyWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.totalSupply('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get totalSupplyEvent() {
                return this._totalSupplyWatcher;
            }
        

            

            public async transfer(params: {_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transfer(params._to, params._value, { from: params.options.from })
            }
        
            private _transferWatcher = {
                watch: async (cb: (args: {_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferEvent() {
                return this._transferWatcher;
            }
        

            

            public async balanceOf(params: {_owner: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.balanceOf.call(params._owner, { from: params.options.from })
            }
        
            private _balanceOfWatcher = {
                watch: async (cb: (args: {_owner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.balanceOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get balanceOfEvent() {
                return this._balanceOfWatcher;
            }
        }
            export class ERC20Basic extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"ERC20Basic","networks":{},"abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        
            private _TransferWatcher = {
                watch: async (cb: (args: {from: string;to: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TransferEvent() {
                return this._TransferWatcher;
            }
        

            

            public async totalSupply(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.totalSupply.call({ from: params.options.from })
            }
        
            private _totalSupplyWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.totalSupply('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get totalSupplyEvent() {
                return this._totalSupplyWatcher;
            }
        

            

            public async balanceOf(params: {_who: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.balanceOf.call(params._who, { from: params.options.from })
            }
        
            private _balanceOfWatcher = {
                watch: async (cb: (args: {_who: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.balanceOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get balanceOfEvent() {
                return this._balanceOfWatcher;
            }
        

            

            public async transfer(params: {_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transfer(params._to, params._value, { from: params.options.from })
            }
        
            private _transferWatcher = {
                watch: async (cb: (args: {_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferEvent() {
                return this._transferWatcher;
            }
        }
            export class FinalizableCrowdsale extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"FinalizableCrowdsale","networks":{},"abi":[{"constant":true,"inputs":[],"name":"hasClosed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"closingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isFinalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"openingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[],"name":"Finalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async hasClosed(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.hasClosed.call({ from: params.options.from })
            }
        
            private _hasClosedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.hasClosed('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get hasClosedEvent() {
                return this._hasClosedWatcher;
            }
        

            

            public async rate(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.rate.call({ from: params.options.from })
            }
        
            private _rateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.rate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get rateEvent() {
                return this._rateWatcher;
            }
        

            

            public async weiRaised(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.weiRaised.call({ from: params.options.from })
            }
        
            private _weiRaisedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.weiRaised('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get weiRaisedEvent() {
                return this._weiRaisedWatcher;
            }
        

            

            public async closingTime(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.closingTime.call({ from: params.options.from })
            }
        
            private _closingTimeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.closingTime('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get closingTimeEvent() {
                return this._closingTimeWatcher;
            }
        

            

            public async wallet(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.wallet.call({ from: params.options.from })
            }
        
            private _walletWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.wallet('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get walletEvent() {
                return this._walletWatcher;
            }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async isFinalized(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.isFinalized.call({ from: params.options.from })
            }
        
            private _isFinalizedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.isFinalized('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get isFinalizedEvent() {
                return this._isFinalizedWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async openingTime(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.openingTime.call({ from: params.options.from })
            }
        
            private _openingTimeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.openingTime('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get openingTimeEvent() {
                return this._openingTimeWatcher;
            }
        

            

            public async buyTokens(params: {_beneficiary: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.buyTokens(params._beneficiary, { from: params.options.from })
            }
        
            private _buyTokensWatcher = {
                watch: async (cb: (args: {_beneficiary: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.buyTokens('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get buyTokensEvent() {
                return this._buyTokensWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        

            

            public async token(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.token.call({ from: params.options.from })
            }
        
            private _tokenWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.token('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get tokenEvent() {
                return this._tokenWatcher;
            }
        
            private _FinalizedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.Finalized('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get FinalizedEvent() {
                return this._FinalizedWatcher;
            }
        
            private _TokenPurchaseWatcher = {
                watch: async (cb: (args: {purchaser: string;beneficiary: string;value: string;amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.TokenPurchase('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TokenPurchaseEvent() {
                return this._TokenPurchaseWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        

            

            public async finalize(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.finalize({ from: params.options.from })
            }
        
            private _finalizeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.finalize('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get finalizeEvent() {
                return this._finalizeWatcher;
            }
        }
            export class Crowdsale extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"Crowdsale","networks":{},"abi":[{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_rate","type":"uint256"},{"name":"_wallet","type":"address"},{"name":"_token","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]})    
                }
        

            

            public async rate(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.rate.call({ from: params.options.from })
            }
        
            private _rateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.rate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get rateEvent() {
                return this._rateWatcher;
            }
        

            

            public async weiRaised(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.weiRaised.call({ from: params.options.from })
            }
        
            private _weiRaisedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.weiRaised('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get weiRaisedEvent() {
                return this._weiRaisedWatcher;
            }
        

            

            public async wallet(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.wallet.call({ from: params.options.from })
            }
        
            private _walletWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.wallet('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get walletEvent() {
                return this._walletWatcher;
            }
        

            

            public async token(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.token.call({ from: params.options.from })
            }
        
            private _tokenWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.token('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get tokenEvent() {
                return this._tokenWatcher;
            }
        
            private _TokenPurchaseWatcher = {
                watch: async (cb: (args: {purchaser: string;beneficiary: string;value: string;amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.TokenPurchase('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TokenPurchaseEvent() {
                return this._TokenPurchaseWatcher;
            }
        

            

            public async buyTokens(params: {_beneficiary: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.buyTokens(params._beneficiary, { from: params.options.from })
            }
        
            private _buyTokensWatcher = {
                watch: async (cb: (args: {_beneficiary: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.buyTokens('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get buyTokensEvent() {
                return this._buyTokensWatcher;
            }
        }
            export class Escrow extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"Escrow","networks":{},"abi":[{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"payee","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"payee","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"depositsOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_payee","type":"address"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_payee","type":"address"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        
            private _DepositedWatcher = {
                watch: async (cb: (args: {payee: string;weiAmount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Deposited('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get DepositedEvent() {
                return this._DepositedWatcher;
            }
        
            private _WithdrawnWatcher = {
                watch: async (cb: (args: {payee: string;weiAmount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Withdrawn('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get WithdrawnEvent() {
                return this._WithdrawnWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        

            

            public async depositsOf(params: {_payee: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.depositsOf.call(params._payee, { from: params.options.from })
            }
        
            private _depositsOfWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.depositsOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get depositsOfEvent() {
                return this._depositsOfWatcher;
            }
        

            

            public async deposit(params: {_payee: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.deposit(params._payee, { from: params.options.from })
            }
        
            private _depositWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.deposit('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get depositEvent() {
                return this._depositWatcher;
            }
        

            

            public async withdraw(params: {_payee: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.withdraw(params._payee, { from: params.options.from })
            }
        
            private _withdrawWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.withdraw('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get withdrawEvent() {
                return this._withdrawWatcher;
            }
        }
            export class Migrations extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"Migrations","networks":{"3":{"events":{},"links":{},"address":"0xadbf1e77c98f8c9bce2350a9a35cf9e504da3919","transactionHash":"0xea66f3dacb44a2ef34d3d23eb25b68f1960114106243ad9dce74ac60cffe23a2"}},"abi":[{"constant":true,"inputs":[],"name":"last_completed_migration","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"completed","type":"uint256"}],"name":"setCompleted","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"new_address","type":"address"}],"name":"upgrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async last_completed_migration(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.last_completed_migration.call({ from: params.options.from })
            }
        
            private _last_completed_migrationWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.last_completed_migration('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get last_completed_migrationEvent() {
                return this._last_completed_migrationWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async setCompleted(params: {completed: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setCompleted(params.completed, { from: params.options.from })
            }
        
            private _setCompletedWatcher = {
                watch: async (cb: (args: {completed: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setCompleted('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setCompletedEvent() {
                return this._setCompletedWatcher;
            }
        

            

            public async upgrade(params: {new_address: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.upgrade(params.new_address, { from: params.options.from })
            }
        
            private _upgradeWatcher = {
                watch: async (cb: (args: {new_address: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.upgrade('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get upgradeEvent() {
                return this._upgradeWatcher;
            }
        }
            export class Ownable extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"Ownable","networks":{},"abi":[{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        }
            export class MintedCrowdsale extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"MintedCrowdsale","networks":{},"abi":[{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"}]})    
                }
        

            

            public async rate(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.rate.call({ from: params.options.from })
            }
        
            private _rateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.rate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get rateEvent() {
                return this._rateWatcher;
            }
        

            

            public async weiRaised(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.weiRaised.call({ from: params.options.from })
            }
        
            private _weiRaisedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.weiRaised('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get weiRaisedEvent() {
                return this._weiRaisedWatcher;
            }
        

            

            public async wallet(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.wallet.call({ from: params.options.from })
            }
        
            private _walletWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.wallet('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get walletEvent() {
                return this._walletWatcher;
            }
        

            

            public async buyTokens(params: {_beneficiary: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.buyTokens(params._beneficiary, { from: params.options.from })
            }
        
            private _buyTokensWatcher = {
                watch: async (cb: (args: {_beneficiary: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.buyTokens('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get buyTokensEvent() {
                return this._buyTokensWatcher;
            }
        

            

            public async token(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.token.call({ from: params.options.from })
            }
        
            private _tokenWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.token('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get tokenEvent() {
                return this._tokenWatcher;
            }
        
            private _TokenPurchaseWatcher = {
                watch: async (cb: (args: {purchaser: string;beneficiary: string;value: string;amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.TokenPurchase('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TokenPurchaseEvent() {
                return this._TokenPurchaseWatcher;
            }
        }
            export class IkuToken extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"IkuToken","networks":{"3":{"events":{},"links":{},"address":"0x2604481b510ee899119718061f00cbc8ed2fb5af","transactionHash":"0xf3c9234be1eeb0c80c9a98411f152e3b8d90e7ef9787d7e5b5ec45fde842b2ca"}},"abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenURI","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"name":"_tokenURI","type":"string"}],"name":"setTokenURI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async name(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.name.call({ from: params.options.from })
            }
        
            private _nameWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.name('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get nameEvent() {
                return this._nameWatcher;
            }
        

            

            public async approve(params: {_spender: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.approve(params._spender, params._value, { from: params.options.from })
            }
        
            private _approveWatcher = {
                watch: async (cb: (args: {_spender: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.approve('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get approveEvent() {
                return this._approveWatcher;
            }
        

            

            public async totalSupply(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.totalSupply.call({ from: params.options.from })
            }
        
            private _totalSupplyWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.totalSupply('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get totalSupplyEvent() {
                return this._totalSupplyWatcher;
            }
        

            

            public async transferFrom(params: {_from: string;
_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transferFrom(params._from, params._to, params._value, { from: params.options.from })
            }
        
            private _transferFromWatcher = {
                watch: async (cb: (args: {_from: string;_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferFrom('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferFromEvent() {
                return this._transferFromWatcher;
            }
        

            

            public async INITIAL_SUPPLY(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.INITIAL_SUPPLY.call({ from: params.options.from })
            }
        
            private _INITIAL_SUPPLYWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.INITIAL_SUPPLY('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get INITIAL_SUPPLYEvent() {
                return this._INITIAL_SUPPLYWatcher;
            }
        

            

            public async decimals(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.decimals.call({ from: params.options.from })
            }
        
            private _decimalsWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.decimals('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get decimalsEvent() {
                return this._decimalsWatcher;
            }
        

            

            public async tokenURI(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.tokenURI.call({ from: params.options.from })
            }
        
            private _tokenURIWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.tokenURI('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get tokenURIEvent() {
                return this._tokenURIWatcher;
            }
        

            

            public async decreaseApproval(params: {_spender: string;
_subtractedValue: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.decreaseApproval(params._spender, params._subtractedValue, { from: params.options.from })
            }
        
            private _decreaseApprovalWatcher = {
                watch: async (cb: (args: {_spender: string;_subtractedValue: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.decreaseApproval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get decreaseApprovalEvent() {
                return this._decreaseApprovalWatcher;
            }
        

            

            public async balanceOf(params: {_owner: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.balanceOf.call(params._owner, { from: params.options.from })
            }
        
            private _balanceOfWatcher = {
                watch: async (cb: (args: {_owner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.balanceOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get balanceOfEvent() {
                return this._balanceOfWatcher;
            }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async symbol(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.symbol.call({ from: params.options.from })
            }
        
            private _symbolWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.symbol('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get symbolEvent() {
                return this._symbolWatcher;
            }
        

            

            public async transfer(params: {_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transfer(params._to, params._value, { from: params.options.from })
            }
        
            private _transferWatcher = {
                watch: async (cb: (args: {_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferEvent() {
                return this._transferWatcher;
            }
        

            

            public async increaseApproval(params: {_spender: string;
_addedValue: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.increaseApproval(params._spender, params._addedValue, { from: params.options.from })
            }
        
            private _increaseApprovalWatcher = {
                watch: async (cb: (args: {_spender: string;_addedValue: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.increaseApproval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get increaseApprovalEvent() {
                return this._increaseApprovalWatcher;
            }
        

            

            public async allowance(params: {_owner: string;
_spender: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.allowance.call(params._owner, params._spender, { from: params.options.from })
            }
        
            private _allowanceWatcher = {
                watch: async (cb: (args: {_owner: string;_spender: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.allowance('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get allowanceEvent() {
                return this._allowanceWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        
            private _ApprovalWatcher = {
                watch: async (cb: (args: {owner: string;spender: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Approval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ApprovalEvent() {
                return this._ApprovalWatcher;
            }
        
            private _TransferWatcher = {
                watch: async (cb: (args: {from: string;to: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TransferEvent() {
                return this._TransferWatcher;
            }
        

            

            public async setTokenURI(params: {_tokenURI: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.setTokenURI(params._tokenURI, { from: params.options.from })
            }
        
            private _setTokenURIWatcher = {
                watch: async (cb: (args: {_tokenURI: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.setTokenURI('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get setTokenURIEvent() {
                return this._setTokenURIWatcher;
            }
        }
            export class MintableToken extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"MintableToken","networks":{},"abi":[{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async mintingFinished(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.mintingFinished.call({ from: params.options.from })
            }
        
            private _mintingFinishedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.mintingFinished('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get mintingFinishedEvent() {
                return this._mintingFinishedWatcher;
            }
        

            

            public async approve(params: {_spender: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.approve(params._spender, params._value, { from: params.options.from })
            }
        
            private _approveWatcher = {
                watch: async (cb: (args: {_spender: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.approve('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get approveEvent() {
                return this._approveWatcher;
            }
        

            

            public async totalSupply(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.totalSupply.call({ from: params.options.from })
            }
        
            private _totalSupplyWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.totalSupply('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get totalSupplyEvent() {
                return this._totalSupplyWatcher;
            }
        

            

            public async transferFrom(params: {_from: string;
_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transferFrom(params._from, params._to, params._value, { from: params.options.from })
            }
        
            private _transferFromWatcher = {
                watch: async (cb: (args: {_from: string;_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferFrom('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferFromEvent() {
                return this._transferFromWatcher;
            }
        

            

            public async decreaseApproval(params: {_spender: string;
_subtractedValue: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.decreaseApproval(params._spender, params._subtractedValue, { from: params.options.from })
            }
        
            private _decreaseApprovalWatcher = {
                watch: async (cb: (args: {_spender: string;_subtractedValue: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.decreaseApproval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get decreaseApprovalEvent() {
                return this._decreaseApprovalWatcher;
            }
        

            

            public async balanceOf(params: {_owner: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.balanceOf.call(params._owner, { from: params.options.from })
            }
        
            private _balanceOfWatcher = {
                watch: async (cb: (args: {_owner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.balanceOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get balanceOfEvent() {
                return this._balanceOfWatcher;
            }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async transfer(params: {_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transfer(params._to, params._value, { from: params.options.from })
            }
        
            private _transferWatcher = {
                watch: async (cb: (args: {_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferEvent() {
                return this._transferWatcher;
            }
        

            

            public async increaseApproval(params: {_spender: string;
_addedValue: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.increaseApproval(params._spender, params._addedValue, { from: params.options.from })
            }
        
            private _increaseApprovalWatcher = {
                watch: async (cb: (args: {_spender: string;_addedValue: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.increaseApproval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get increaseApprovalEvent() {
                return this._increaseApprovalWatcher;
            }
        

            

            public async allowance(params: {_owner: string;
_spender: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.allowance.call(params._owner, params._spender, { from: params.options.from })
            }
        
            private _allowanceWatcher = {
                watch: async (cb: (args: {_owner: string;_spender: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.allowance('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get allowanceEvent() {
                return this._allowanceWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        
            private _MintWatcher = {
                watch: async (cb: (args: {to: string;amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Mint('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get MintEvent() {
                return this._MintWatcher;
            }
        
            private _MintFinishedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.MintFinished('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get MintFinishedEvent() {
                return this._MintFinishedWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        
            private _ApprovalWatcher = {
                watch: async (cb: (args: {owner: string;spender: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Approval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ApprovalEvent() {
                return this._ApprovalWatcher;
            }
        
            private _TransferWatcher = {
                watch: async (cb: (args: {from: string;to: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TransferEvent() {
                return this._TransferWatcher;
            }
        

            

            public async mint(params: {_to: string;
_amount: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.mint(params._to, params._amount, { from: params.options.from })
            }
        
            private _mintWatcher = {
                watch: async (cb: (args: {_to: string;_amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.mint('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get mintEvent() {
                return this._mintWatcher;
            }
        

            

            public async finishMinting(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.finishMinting({ from: params.options.from })
            }
        
            private _finishMintingWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.finishMinting('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get finishMintingEvent() {
                return this._finishMintingWatcher;
            }
        }
            export class ResearchSpecificToken extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"ResearchSpecificToken","networks":{},"abi":[{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenName","type":"string"},{"name":"_tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]})    
                }
        

            

            public async mintingFinished(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.mintingFinished.call({ from: params.options.from })
            }
        
            private _mintingFinishedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.mintingFinished('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get mintingFinishedEvent() {
                return this._mintingFinishedWatcher;
            }
        

            

            public async name(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.name.call({ from: params.options.from })
            }
        
            private _nameWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.name('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get nameEvent() {
                return this._nameWatcher;
            }
        

            

            public async approve(params: {_spender: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.approve(params._spender, params._value, { from: params.options.from })
            }
        
            private _approveWatcher = {
                watch: async (cb: (args: {_spender: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.approve('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get approveEvent() {
                return this._approveWatcher;
            }
        

            

            public async totalSupply(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.totalSupply.call({ from: params.options.from })
            }
        
            private _totalSupplyWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.totalSupply('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get totalSupplyEvent() {
                return this._totalSupplyWatcher;
            }
        

            

            public async transferFrom(params: {_from: string;
_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transferFrom(params._from, params._to, params._value, { from: params.options.from })
            }
        
            private _transferFromWatcher = {
                watch: async (cb: (args: {_from: string;_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferFrom('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferFromEvent() {
                return this._transferFromWatcher;
            }
        

            

            public async decimals(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.decimals.call({ from: params.options.from })
            }
        
            private _decimalsWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.decimals('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get decimalsEvent() {
                return this._decimalsWatcher;
            }
        

            

            public async mint(params: {_to: string;
_amount: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.mint(params._to, params._amount, { from: params.options.from })
            }
        
            private _mintWatcher = {
                watch: async (cb: (args: {_to: string;_amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.mint('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get mintEvent() {
                return this._mintWatcher;
            }
        

            

            public async decreaseApproval(params: {_spender: string;
_subtractedValue: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.decreaseApproval(params._spender, params._subtractedValue, { from: params.options.from })
            }
        
            private _decreaseApprovalWatcher = {
                watch: async (cb: (args: {_spender: string;_subtractedValue: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.decreaseApproval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get decreaseApprovalEvent() {
                return this._decreaseApprovalWatcher;
            }
        

            

            public async balanceOf(params: {_owner: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.balanceOf.call(params._owner, { from: params.options.from })
            }
        
            private _balanceOfWatcher = {
                watch: async (cb: (args: {_owner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.balanceOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get balanceOfEvent() {
                return this._balanceOfWatcher;
            }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async finishMinting(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.finishMinting({ from: params.options.from })
            }
        
            private _finishMintingWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.finishMinting('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get finishMintingEvent() {
                return this._finishMintingWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async symbol(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.symbol.call({ from: params.options.from })
            }
        
            private _symbolWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.symbol('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get symbolEvent() {
                return this._symbolWatcher;
            }
        

            

            public async transfer(params: {_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transfer(params._to, params._value, { from: params.options.from })
            }
        
            private _transferWatcher = {
                watch: async (cb: (args: {_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferEvent() {
                return this._transferWatcher;
            }
        

            

            public async increaseApproval(params: {_spender: string;
_addedValue: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.increaseApproval(params._spender, params._addedValue, { from: params.options.from })
            }
        
            private _increaseApprovalWatcher = {
                watch: async (cb: (args: {_spender: string;_addedValue: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.increaseApproval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get increaseApprovalEvent() {
                return this._increaseApprovalWatcher;
            }
        

            

            public async allowance(params: {_owner: string;
_spender: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.allowance.call(params._owner, params._spender, { from: params.options.from })
            }
        
            private _allowanceWatcher = {
                watch: async (cb: (args: {_owner: string;_spender: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.allowance('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get allowanceEvent() {
                return this._allowanceWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        
            private _MintWatcher = {
                watch: async (cb: (args: {to: string;amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Mint('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get MintEvent() {
                return this._MintWatcher;
            }
        
            private _MintFinishedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.MintFinished('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get MintFinishedEvent() {
                return this._MintFinishedWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        
            private _ApprovalWatcher = {
                watch: async (cb: (args: {owner: string;spender: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Approval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ApprovalEvent() {
                return this._ApprovalWatcher;
            }
        
            private _TransferWatcher = {
                watch: async (cb: (args: {from: string;to: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TransferEvent() {
                return this._TransferWatcher;
            }
        }
            export class RefundEscrow extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"RefundEscrow","networks":{},"abi":[{"constant":true,"inputs":[],"name":"beneficiary","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_payee","type":"address"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"depositsOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_beneficiary","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Closed","type":"event"},{"anonymous":false,"inputs":[],"name":"RefundsEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"payee","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"payee","type":"address"},{"indexed":false,"name":"weiAmount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_refundee","type":"address"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"close","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"enableRefunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"beneficiaryWithdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"withdrawalAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]})    
                }
        

            

            public async beneficiary(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.beneficiary.call({ from: params.options.from })
            }
        
            private _beneficiaryWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.beneficiary('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get beneficiaryEvent() {
                return this._beneficiaryWatcher;
            }
        

            

            public async withdraw(params: {_payee: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.withdraw(params._payee, { from: params.options.from })
            }
        
            private _withdrawWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.withdraw('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get withdrawEvent() {
                return this._withdrawWatcher;
            }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async state(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.state.call({ from: params.options.from })
            }
        
            private _stateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.state('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get stateEvent() {
                return this._stateWatcher;
            }
        

            

            public async depositsOf(params: {_payee: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.depositsOf.call(params._payee, { from: params.options.from })
            }
        
            private _depositsOfWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.depositsOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get depositsOfEvent() {
                return this._depositsOfWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        
            private _ClosedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.Closed('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ClosedEvent() {
                return this._ClosedWatcher;
            }
        
            private _RefundsEnabledWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.RefundsEnabled('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get RefundsEnabledEvent() {
                return this._RefundsEnabledWatcher;
            }
        
            private _DepositedWatcher = {
                watch: async (cb: (args: {payee: string;weiAmount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Deposited('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get DepositedEvent() {
                return this._DepositedWatcher;
            }
        
            private _WithdrawnWatcher = {
                watch: async (cb: (args: {payee: string;weiAmount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Withdrawn('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get WithdrawnEvent() {
                return this._WithdrawnWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        

            

            public async deposit(params: {_refundee: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.deposit(params._refundee, { from: params.options.from })
            }
        
            private _depositWatcher = {
                watch: async (cb: (args: {_refundee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.deposit('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get depositEvent() {
                return this._depositWatcher;
            }
        

            

            public async close(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.close({ from: params.options.from })
            }
        
            private _closeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.close('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get closeEvent() {
                return this._closeWatcher;
            }
        

            

            public async enableRefunds(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.enableRefunds({ from: params.options.from })
            }
        
            private _enableRefundsWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.enableRefunds('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get enableRefundsEvent() {
                return this._enableRefundsWatcher;
            }
        

            

            public async beneficiaryWithdraw(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.beneficiaryWithdraw({ from: params.options.from })
            }
        
            private _beneficiaryWithdrawWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.beneficiaryWithdraw('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get beneficiaryWithdrawEvent() {
                return this._beneficiaryWithdrawWatcher;
            }
        

            

            public async withdrawalAllowed(params: {_payee: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.withdrawalAllowed.call(params._payee, { from: params.options.from })
            }
        
            private _withdrawalAllowedWatcher = {
                watch: async (cb: (args: {_payee: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.withdrawalAllowed('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get withdrawalAllowedEvent() {
                return this._withdrawalAllowedWatcher;
            }
        }
            export class RefundableCrowdsale extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"RefundableCrowdsale","networks":{},"abi":[{"constant":true,"inputs":[],"name":"hasClosed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"goal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"closingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isFinalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"openingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_goal","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[],"name":"Finalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[],"name":"claimRefund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"goalReached","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]})    
                }
        

            

            public async hasClosed(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.hasClosed.call({ from: params.options.from })
            }
        
            private _hasClosedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.hasClosed('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get hasClosedEvent() {
                return this._hasClosedWatcher;
            }
        

            

            public async rate(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.rate.call({ from: params.options.from })
            }
        
            private _rateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.rate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get rateEvent() {
                return this._rateWatcher;
            }
        

            

            public async goal(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.goal.call({ from: params.options.from })
            }
        
            private _goalWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.goal('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get goalEvent() {
                return this._goalWatcher;
            }
        

            

            public async weiRaised(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.weiRaised.call({ from: params.options.from })
            }
        
            private _weiRaisedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.weiRaised('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get weiRaisedEvent() {
                return this._weiRaisedWatcher;
            }
        

            

            public async closingTime(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.closingTime.call({ from: params.options.from })
            }
        
            private _closingTimeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.closingTime('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get closingTimeEvent() {
                return this._closingTimeWatcher;
            }
        

            

            public async finalize(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.finalize({ from: params.options.from })
            }
        
            private _finalizeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.finalize('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get finalizeEvent() {
                return this._finalizeWatcher;
            }
        

            

            public async wallet(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.wallet.call({ from: params.options.from })
            }
        
            private _walletWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.wallet('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get walletEvent() {
                return this._walletWatcher;
            }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async isFinalized(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.isFinalized.call({ from: params.options.from })
            }
        
            private _isFinalizedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.isFinalized('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get isFinalizedEvent() {
                return this._isFinalizedWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async openingTime(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.openingTime.call({ from: params.options.from })
            }
        
            private _openingTimeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.openingTime('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get openingTimeEvent() {
                return this._openingTimeWatcher;
            }
        

            

            public async buyTokens(params: {_beneficiary: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.buyTokens(params._beneficiary, { from: params.options.from })
            }
        
            private _buyTokensWatcher = {
                watch: async (cb: (args: {_beneficiary: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.buyTokens('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get buyTokensEvent() {
                return this._buyTokensWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        

            

            public async token(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.token.call({ from: params.options.from })
            }
        
            private _tokenWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.token('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get tokenEvent() {
                return this._tokenWatcher;
            }
        
            private _FinalizedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.Finalized('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get FinalizedEvent() {
                return this._FinalizedWatcher;
            }
        
            private _TokenPurchaseWatcher = {
                watch: async (cb: (args: {purchaser: string;beneficiary: string;value: string;amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.TokenPurchase('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TokenPurchaseEvent() {
                return this._TokenPurchaseWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        

            

            public async claimRefund(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.claimRefund({ from: params.options.from })
            }
        
            private _claimRefundWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.claimRefund('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get claimRefundEvent() {
                return this._claimRefundWatcher;
            }
        

            

            public async goalReached(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.goalReached.call({ from: params.options.from })
            }
        
            private _goalReachedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.goalReached('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get goalReachedEvent() {
                return this._goalReachedWatcher;
            }
        }
            export class SafeMath extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"SafeMath","networks":{},"abi":[]})    
                }
        }
            export class TimedCrowdsale extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"TimedCrowdsale","networks":{},"abi":[{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"closingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"openingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_openingTime","type":"uint256"},{"name":"_closingTime","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"},{"constant":true,"inputs":[],"name":"hasClosed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]})    
                }
        

            

            public async rate(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.rate.call({ from: params.options.from })
            }
        
            private _rateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.rate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get rateEvent() {
                return this._rateWatcher;
            }
        

            

            public async weiRaised(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.weiRaised.call({ from: params.options.from })
            }
        
            private _weiRaisedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.weiRaised('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get weiRaisedEvent() {
                return this._weiRaisedWatcher;
            }
        

            

            public async closingTime(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.closingTime.call({ from: params.options.from })
            }
        
            private _closingTimeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.closingTime('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get closingTimeEvent() {
                return this._closingTimeWatcher;
            }
        

            

            public async wallet(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.wallet.call({ from: params.options.from })
            }
        
            private _walletWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.wallet('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get walletEvent() {
                return this._walletWatcher;
            }
        

            

            public async openingTime(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.openingTime.call({ from: params.options.from })
            }
        
            private _openingTimeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.openingTime('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get openingTimeEvent() {
                return this._openingTimeWatcher;
            }
        

            

            public async buyTokens(params: {_beneficiary: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.buyTokens(params._beneficiary, { from: params.options.from })
            }
        
            private _buyTokensWatcher = {
                watch: async (cb: (args: {_beneficiary: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.buyTokens('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get buyTokensEvent() {
                return this._buyTokensWatcher;
            }
        

            

            public async token(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.token.call({ from: params.options.from })
            }
        
            private _tokenWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.token('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get tokenEvent() {
                return this._tokenWatcher;
            }
        
            private _TokenPurchaseWatcher = {
                watch: async (cb: (args: {purchaser: string;beneficiary: string;value: string;amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.TokenPurchase('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TokenPurchaseEvent() {
                return this._TokenPurchaseWatcher;
            }
        

            

            public async hasClosed(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.hasClosed.call({ from: params.options.from })
            }
        
            private _hasClosedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.hasClosed('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get hasClosedEvent() {
                return this._hasClosedWatcher;
            }
        }
            export class StandardToken extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"StandardToken","networks":{},"abi":[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]})    
                }
        

            

            public async totalSupply(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.totalSupply.call({ from: params.options.from })
            }
        
            private _totalSupplyWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.totalSupply('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get totalSupplyEvent() {
                return this._totalSupplyWatcher;
            }
        

            

            public async balanceOf(params: {_owner: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.balanceOf.call(params._owner, { from: params.options.from })
            }
        
            private _balanceOfWatcher = {
                watch: async (cb: (args: {_owner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.balanceOf('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get balanceOfEvent() {
                return this._balanceOfWatcher;
            }
        

            

            public async transfer(params: {_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transfer(params._to, params._value, { from: params.options.from })
            }
        
            private _transferWatcher = {
                watch: async (cb: (args: {_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferEvent() {
                return this._transferWatcher;
            }
        
            private _ApprovalWatcher = {
                watch: async (cb: (args: {owner: string;spender: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Approval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ApprovalEvent() {
                return this._ApprovalWatcher;
            }
        
            private _TransferWatcher = {
                watch: async (cb: (args: {from: string;to: string;value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.Transfer('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TransferEvent() {
                return this._TransferWatcher;
            }
        

            

            public async transferFrom(params: {_from: string;
_to: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.transferFrom(params._from, params._to, params._value, { from: params.options.from })
            }
        
            private _transferFromWatcher = {
                watch: async (cb: (args: {_from: string;_to: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferFrom('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferFromEvent() {
                return this._transferFromWatcher;
            }
        

            

            public async approve(params: {_spender: string;
_value: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.approve(params._spender, params._value, { from: params.options.from })
            }
        
            private _approveWatcher = {
                watch: async (cb: (args: {_spender: string;_value: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.approve('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get approveEvent() {
                return this._approveWatcher;
            }
        

            

            public async allowance(params: {_owner: string;
_spender: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.allowance.call(params._owner, params._spender, { from: params.options.from })
            }
        
            private _allowanceWatcher = {
                watch: async (cb: (args: {_owner: string;_spender: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.allowance('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get allowanceEvent() {
                return this._allowanceWatcher;
            }
        

            

            public async increaseApproval(params: {_spender: string;
_addedValue: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.increaseApproval(params._spender, params._addedValue, { from: params.options.from })
            }
        
            private _increaseApprovalWatcher = {
                watch: async (cb: (args: {_spender: string;_addedValue: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.increaseApproval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get increaseApprovalEvent() {
                return this._increaseApprovalWatcher;
            }
        

            

            public async decreaseApproval(params: {_spender: string;
_subtractedValue: string;
options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.decreaseApproval(params._spender, params._subtractedValue, { from: params.options.from })
            }
        
            private _decreaseApprovalWatcher = {
                watch: async (cb: (args: {_spender: string;_subtractedValue: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.decreaseApproval('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get decreaseApprovalEvent() {
                return this._decreaseApprovalWatcher;
            }
        }
            export class RSTCrowdsale extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"RSTCrowdsale","networks":{},"abi":[{"constant":true,"inputs":[],"name":"hasClosed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"goal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"closingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"capReached","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"goalReached","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isFinalized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claimRefund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"openingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_openingTime","type":"uint256"},{"name":"_closingTime","type":"uint256"},{"name":"_rate","type":"uint256"},{"name":"_wallet","type":"address"},{"name":"_cap","type":"uint256"},{"name":"_token","type":"address"},{"name":"_goal","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[],"name":"Finalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]})    
                }
        

            

            public async hasClosed(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.hasClosed.call({ from: params.options.from })
            }
        
            private _hasClosedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.hasClosed('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get hasClosedEvent() {
                return this._hasClosedWatcher;
            }
        

            

            public async rate(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.rate.call({ from: params.options.from })
            }
        
            private _rateWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.rate('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get rateEvent() {
                return this._rateWatcher;
            }
        

            

            public async cap(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.cap.call({ from: params.options.from })
            }
        
            private _capWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.cap('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get capEvent() {
                return this._capWatcher;
            }
        

            

            public async goal(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.goal.call({ from: params.options.from })
            }
        
            private _goalWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.goal('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get goalEvent() {
                return this._goalWatcher;
            }
        

            

            public async weiRaised(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.weiRaised.call({ from: params.options.from })
            }
        
            private _weiRaisedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.weiRaised('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get weiRaisedEvent() {
                return this._weiRaisedWatcher;
            }
        

            

            public async closingTime(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.closingTime.call({ from: params.options.from })
            }
        
            private _closingTimeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.closingTime('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get closingTimeEvent() {
                return this._closingTimeWatcher;
            }
        

            

            public async finalize(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.finalize({ from: params.options.from })
            }
        
            private _finalizeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.finalize('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get finalizeEvent() {
                return this._finalizeWatcher;
            }
        

            

            public async capReached(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.capReached.call({ from: params.options.from })
            }
        
            private _capReachedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.capReached('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get capReachedEvent() {
                return this._capReachedWatcher;
            }
        

            

            public async wallet(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.wallet.call({ from: params.options.from })
            }
        
            private _walletWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.wallet('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get walletEvent() {
                return this._walletWatcher;
            }
        

            

            public async renounceOwnership(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.renounceOwnership({ from: params.options.from })
            }
        
            private _renounceOwnershipWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.renounceOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get renounceOwnershipEvent() {
                return this._renounceOwnershipWatcher;
            }
        

            

            public async goalReached(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.goalReached.call({ from: params.options.from })
            }
        
            private _goalReachedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.goalReached('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get goalReachedEvent() {
                return this._goalReachedWatcher;
            }
        

            

            public async isFinalized(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.isFinalized.call({ from: params.options.from })
            }
        
            private _isFinalizedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.isFinalized('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get isFinalizedEvent() {
                return this._isFinalizedWatcher;
            }
        

            

            public async owner(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.owner.call({ from: params.options.from })
            }
        
            private _ownerWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.owner('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get ownerEvent() {
                return this._ownerWatcher;
            }
        

            

            public async claimRefund(params: {options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.claimRefund({ from: params.options.from })
            }
        
            private _claimRefundWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.claimRefund('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get claimRefundEvent() {
                return this._claimRefundWatcher;
            }
        

            

            public async openingTime(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.openingTime.call({ from: params.options.from })
            }
        
            private _openingTimeWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.openingTime('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get openingTimeEvent() {
                return this._openingTimeWatcher;
            }
        

            

            public async buyTokens(params: {_beneficiary: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.buyTokens(params._beneficiary, { from: params.options.from })
            }
        
            private _buyTokensWatcher = {
                watch: async (cb: (args: {_beneficiary: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.buyTokens('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get buyTokensEvent() {
                return this._buyTokensWatcher;
            }
        

            

            public async transferOwnership(params: {_newOwner: string;
options: { from: string }}): Promise<void | null> {
                const instance = await this._getInstance();
                return await instance.transferOwnership(params._newOwner, { from: params.options.from })
            }
        
            private _transferOwnershipWatcher = {
                watch: async (cb: (args: {_newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.transferOwnership('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get transferOwnershipEvent() {
                return this._transferOwnershipWatcher;
            }
        

            

            public async token(params: {options: { from: string }}): Promise<string | null> {
                const instance = await this._getInstance();
                return await instance.token.call({ from: params.options.from })
            }
        
            private _tokenWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.token('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get tokenEvent() {
                return this._tokenWatcher;
            }
        
            private _FinalizedWatcher = {
                watch: async (cb: (args: {}) => void) => {
                    const instance = await this._getInstance();
                    instance.Finalized('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get FinalizedEvent() {
                return this._FinalizedWatcher;
            }
        
            private _TokenPurchaseWatcher = {
                watch: async (cb: (args: {purchaser: string;beneficiary: string;value: string;amount: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.TokenPurchase('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get TokenPurchaseEvent() {
                return this._TokenPurchaseWatcher;
            }
        
            private _OwnershipRenouncedWatcher = {
                watch: async (cb: (args: {previousOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipRenounced('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipRenouncedEvent() {
                return this._OwnershipRenouncedWatcher;
            }
        
            private _OwnershipTransferredWatcher = {
                watch: async (cb: (args: {previousOwner: string;newOwner: string}) => void) => {
                    const instance = await this._getInstance();
                    instance.OwnershipTransferred('latest').watch((error: Error, result: any) => {
                        cb(result.args);
                    });
                }
            }

            public get OwnershipTransferredEvent() {
                return this._OwnershipTransferredWatcher;
            }
        }
            export class SafeERC20 extends StaticWeb3Contract {    
                constructor() {
                    super({"contractName":"SafeERC20","networks":{},"abi":[]})    
                }
        }