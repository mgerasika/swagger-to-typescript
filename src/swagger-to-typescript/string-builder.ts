export class StringBuilder {
    _res = '';
    _tabCount = 0;

    setTabCount(tabCount: number): void {
        this._tabCount = tabCount;
    }
    append(arg: string): void {
        this._res = this._res + arg;
    }

    appendLine(arg: string, tabCount = this._tabCount): void {
        const tabs = Array.from(Array(tabCount).keys())
            .map(() => '\t')
            .join('');
        this._res = this._res + tabs + arg + '\n';
    }

    toString(): string {
        return this._res;
    }
}
