async function dynamicContext(folderPath, regex) {
  const files = await import.meta.globEager(folderPath);
  return Object.keys(files)
  .filter((path) => regex.test(path))
  .map((path) => files[path].default || files[path]);
}

const files = await dynamicContext('./path/to/folder', /\.vue$/);
files.forEach((file) => {
  const componentName = file.name || file.default.name;
  app.component(componentName, file.default || file);
});

console.log(files)

export  default  files
