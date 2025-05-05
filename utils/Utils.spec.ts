import { isEmpty, isNotEmpty } from "./Utils"

describe('Utils.isEmpty() tests', () => {
    it('isEmpty should return true when empty string', () => {
        expect(isEmpty('')).toBeTruthy()
    })

    it('isEmpty should return true when null string', () => {
        expect(isEmpty(null)).toBeTruthy()
    })

    it('isEmpty should false true when string', () => {
        expect(isEmpty('string')).toBeFalsy()
    })
})

describe('Utils.isNotEmpty() tests', () => {
    it('isNotEmpty should return true when string', () => {
        expect(isNotEmpty('valid')).toBeTruthy()
    })

    it('isNotEmpty should return false when null string', () => {
        expect(isNotEmpty(null)).toBeFalsy()
    })

    it('isNotEmpty should false true when empty string', () => {
        expect(isNotEmpty('')).toBeFalsy()
    })
})
