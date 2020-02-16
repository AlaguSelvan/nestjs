import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User entity', () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';
    // @ts-ignore: Unreachable code error
    bcrypt.hash = jest.fn();
  });
  describe('validatePassword', () => {
    it ('returns true as password is valid', async () => {
      // @ts-ignore: Unreachable code error
      bcrypt.hash.mockReturnValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      // @ts-ignore: Unreachable code error
      bcrypt.hash.mockReturnValue('wrongpassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrongpassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('wrongpassword', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
