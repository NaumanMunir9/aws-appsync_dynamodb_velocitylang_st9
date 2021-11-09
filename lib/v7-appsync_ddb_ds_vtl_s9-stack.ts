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
      readCapacity: 1,
      writeCapacity: 1,
    });

    // DynamoDB Table DataSource attached to AppSync API
    const ddb_datasource = api.addDynamoDbDataSource("MyDynamoTable", table);

    // Resolvers
    // Mutation => addProduct
    ddb_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "addProduct",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "PutItem",
          "key" : {
            "id" : $util.dynamodb.toDynamoDBJson($util.autoId())
          },
          "attributeValues" : $util.dynamodb.toMapValuesJson($context.arguments.product)
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        $util.qr($context.result.put("name", "$context.result.name $context.result.price"))
        $util.toJson($context.result)
      `),
    });

    // Query => getProductList
    ddb_datasource.createResolver({
      typeName: "Query",
      fieldName: "getProductList",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "Scan"
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(`
        $util.toJson($context.result.items)
      `),
    });
  }
}
