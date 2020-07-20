function foo(firstName: string, lastName?: string) {
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName;
}

export { foo };
