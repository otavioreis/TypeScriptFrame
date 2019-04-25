namespace Core {
    class ptBR {
        money: Money = new Money;
    }

    class Money {
        decimal: string = ',';
        thousandSeparator: string = '.';
    }

    export class Culture {
        static ptBR: ptBR = new ptBR;
    }
}