
/**
 * Warning: This is an autogenerated file.
 *
 * Changes in this file won't take effect and will be overwritten
 */

// Base Types
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type Maybe<T> = T | null | undefined
type Scalars = {
  Boolean: boolean
  String: string
  Float: number
  Int: number
  ID: string
}

// Operation related types
export type ProductsSuggestionsQueryQueryVariables = Exact<{
  fullText: Scalars['String'];
  facetKey: Maybe<Scalars['String']>;
  facetValue: Maybe<Scalars['String']>;
  productOriginVtex?: Maybe<Scalars['Boolean']>;
  simulationBehavior?: Maybe<Vtex_SimulationBehavior>;
}>;


export type ProductsSuggestionsQueryQuery = { vtex: { productSuggestions: Maybe<{ count: number, products: Array<Maybe<{ productId: Maybe<string>, productName: Maybe<string>, linkText: Maybe<string>, key: Maybe<string>, productClusters: Maybe<Array<Maybe<{ name: Maybe<string> }>>>, items: Maybe<Array<Maybe<{ itemId: Maybe<string>, images: Maybe<Array<Maybe<{ imageUrl: Maybe<string>, imageText: Maybe<string> }>>>, sellers: Maybe<Array<Maybe<{ sellerId: Maybe<string>, commercialOffer: Maybe<{ spotPrice: Maybe<number>, availableQuantity: Maybe<number>, price: Maybe<number>, listPrice: Maybe<number>, maxInstallments: Maybe<Array<Maybe<{ value: Maybe<number>, numberOfInstallments: Maybe<number> }>>>, installments: Maybe<Array<Maybe<{ value: Maybe<number>, numberOfInstallments: Maybe<number>, interestRate: Maybe<number> }>>>, teasers: Maybe<Array<{ name: Maybe<string> }>> }> }>>> }>>> }>> }> } };


// Query Related Code

export const ProductsSuggestionsQuery = {
  query: undefined,
  sha256Hash: "5e9464033053ffb62c46e06796ba23410850dadf19000d2a056e3d46db2a68c6",
  operationName: "ProductsSuggestionsQuery",
}

