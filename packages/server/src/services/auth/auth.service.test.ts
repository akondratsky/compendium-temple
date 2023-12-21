import { mock, instance, when, verify, anything, deepEqual } from 'ts-mockito';
import { Test } from '@nestjs/testing';
import { REQUEST } from '@nestjs/core';
import { GitHubUser } from '@prisma/client';

import { AuthService } from './auth.service';
import { GithubUserProvider } from '../../providers/githubUser';
import { CompendiumUserProvider } from '../../providers/compendiumUser';
import { HashService } from '../hash';
import { OctokitClient } from '../../dataAccess/octokit';

describe('AuthService', () => {
  let authService: AuthService;
  let mockGithubUserProvider: GithubUserProvider;
  let mockCompendiumUserProvider: CompendiumUserProvider;
  let mockHashService: HashService;
  let mockOctokitClient: OctokitClient;

  const tokenStub = 'test-token';

  beforeEach(async () => {
    mockGithubUserProvider = mock(GithubUserProvider);
    mockCompendiumUserProvider = mock(CompendiumUserProvider);
    mockHashService = mock(HashService);
    mockOctokitClient = mock(OctokitClient);

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: REQUEST, useValue: { header: () => tokenStub } },
        { provide: GithubUserProvider, useValue: instance(mockGithubUserProvider) },
        { provide: CompendiumUserProvider, useValue: instance(mockCompendiumUserProvider) },
        { provide: HashService, useValue: instance(mockHashService) },
        { provide: OctokitClient, useValue: instance(mockOctokitClient) },
      ],
    }).compile();

    authService = await moduleRef.resolve<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('authenticate()', () => {
    it('authenticate with CompendiumUserProvider', async () => {
      const hashedToken = 'hashed-token';
      const compendiumUser = { id: 1, login: 'test', hash: hashedToken };
      when(mockHashService.calc(tokenStub)).thenResolve(hashedToken);
      when(mockCompendiumUserProvider.getByHash(hashedToken)).thenResolve(compendiumUser);

      expect(await authService.authenticate()).toBe(true);
      verify(mockCompendiumUserProvider.getByHash(hashedToken)).once();
    });

    it('authenticate with OctokitClient', async () => {
      const hashedToken = 'hashed-token';
      const githubUser = { id: 1, login: 'test' } as GitHubUser;
      const compendiumUser = { id: 1, login: 'test', hash: hashedToken };
  
      when(mockHashService.calc(tokenStub)).thenResolve(hashedToken);
      when(mockCompendiumUserProvider.getByHash(hashedToken)).thenResolve(null);
      when(mockOctokitClient.getAuthenticatedUser(tokenStub)).thenResolve(githubUser);
      when(mockGithubUserProvider.upsert(anything())).thenResolve(undefined);
      when(mockCompendiumUserProvider.upsert(anything())).thenResolve(undefined);
  
      expect(await authService.authenticate()).toBe(true);
      verify(mockCompendiumUserProvider.getByHash(hashedToken)).once();
      verify(mockGithubUserProvider.upsert(githubUser)).once();
      verify(mockCompendiumUserProvider.upsert(deepEqual(compendiumUser))).once();
    });
  });
});