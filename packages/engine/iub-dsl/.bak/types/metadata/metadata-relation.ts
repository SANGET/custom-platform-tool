export interface QuoteRef {
  connectKey: string; // tableId.filed
  key?: string; // tableId.id
  value?: string; // tableId.show
}

/**
 * 数据源关系
 */
type QuoteType = 'quote' | 'treeQuote' | 'foreignKey';

interface DataQuoteRelation {
  type: 'quote',
  field: string,
  quoteInfo: {
    table: string,
    field: string,
    quoteType: QuoteType
  }
}
export type DataSourceRelation = DataQuoteRelation

export interface DataQuoteRelationRef {
  useQuoteRelation?: string | string[];
}
