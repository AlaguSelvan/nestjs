import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword' };

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
      ],
    }).compile();
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signup', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('Successfully signs up the user', () => {
       save.mockResolvedValue(undefined);
       expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws a conflic exception as username already exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
    });
    it('throws a conflic exception as username already exists', () => {
      save.mockRejectedValue({ code: '123123' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
    });
  });
  describe('validateUserPassword', () => {
    let user;
    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'TestUsername';
      user.validatePassword = jest.fn();
    });
    it('returns the username as validation is successfull', async () => {
       userRepository.findOne.mockResolvedValue(user);
       user.validatePassword.mockResolvedValue(true);
       const result = await userRepository.validateUserPassword(mockCredentialsDto);
    });

    it('returns null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBe(null);
    });

    it('returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(result).toBeNull();
    });
  });
  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
        // @ts-ignore: Unreachable code error
       bcrypt.hash = jest.fn().mockResolvedValue('testHash');
       expect(bcrypt.hash).not.toHaveBeenCalled();
       const result = await userRepository.hashPassword('testPassword', 'testSalt');
       expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
       expect(result).toEqual('testHash');
    });
  });
});
