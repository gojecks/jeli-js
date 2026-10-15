import assert from 'node:assert/strict';
import { FormValidationStack } from '../packages/form/src/validator.stack.js';

describe('FormValidationStack.EMAILVALIDATION', () => {
    it('accepts common real-world addresses', () => {
        for (const email of ['nobody@example.com', 'first-last@company.com', 'name+tag@gmail.com', "o'brien@x.ie", 'a.b.c@sub.domain.org', 'user_1@x.co']) {
            assert.equal(FormValidationStack.EMAILVALIDATION(email), true, email);
        }
    });

    it('rejects malformed addresses', () => {
        for (const email of ['abc', 'abc@', 'abc@def', '.lead@x.com', 'trail.@x.com', 'do..ts@x.com', 'a b@x.com', 'a@b.c']) {
            assert.equal(FormValidationStack.EMAILVALIDATION(email), false, email);
        }
    });

    it('leaves empty values to the required validator', () => {
        assert.equal(FormValidationStack.EMAILVALIDATION(''), true);
        assert.equal(FormValidationStack.EMAILVALIDATION(null), true);
    });
});
