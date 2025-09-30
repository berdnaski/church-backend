export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public tenantId: string,
    public roles: string[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static fromPrisma(user: any): UserEntity {
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.tenantId,
      user.roles.map((role: any) => role.role),
      user.createdAt,
      user.updatedAt,
    );
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}