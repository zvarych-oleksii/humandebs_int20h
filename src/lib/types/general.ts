export interface BackendEvent<T> {
    event_type: string;
    transaction_hash: string;
    block_number: number;
    args: T;
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface HTTPValidationError {
    detail: ValidationError[];
}
