import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";

export class V7AppsyncDdbDsVtlS9Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // AppSync API
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "cdk-aapsync-ddb-vtl",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });

    // DynamoDB Table
    const table = new ddb.Table(this, "ProductTableDynamo", {
      tableName: "NewProduct",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
  }
}
