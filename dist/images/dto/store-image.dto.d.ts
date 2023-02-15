export declare class StoreImageDto {
    readonly title: string;
    readonly width?: number;
    readonly height?: number;
    constructor(title: string, width?: number, height?: number);
    imageShouldBeResized(): boolean;
}
