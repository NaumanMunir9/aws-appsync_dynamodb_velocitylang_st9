import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as V7AppsyncDdbDsVtlS9 from '../lib/v7-appsync_ddb_ds_vtl_s9-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new V7AppsyncDdbDsVtlS9.V7AppsyncDdbDsVtlS9Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT));
});
