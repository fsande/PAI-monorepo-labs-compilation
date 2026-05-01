# PAI-monorepo-labs-compilation

Colección de proyectos web desplegados en GitHub Pages.

## Proyectos disponibles
- [Funciones](https://usuario.github.io/PAI-monorepo-labs-compilation/p09-funciones/)
- [Tiro Parabólico](https://usuario.github.io/PAI-monorepo-labs-compilation/p10-proyectiles/)
- [Curvas de Lissajous](https://usuario.github.io/PAI-monorepo-labs-compilation/p11-lissajous/)

## Desarrollo local
```bash
npm install          # Instala todas las dependencias
npm run dev:p09      # Arranca el proyecto p09 en modo desarrollo
npm run dev:p10      # Arranca el proyecto p10 en modo desarrollo
npm run dev:p11      # Arranca el proyecto p11 en modo desarrollo
npm run build:all    # Construye todos los proyectos
```

## Para incluir un nuevo proyecto:
1. Clonar el repo
```bash
$ git clone git@github.com:fsande/PAI-monorepo-labs-compilation.git root
$ cd root
```
1. Crear un subdirectorio para el nuevo proyecto:
```bash
$ mkidr new-project
```
1. Copiar en el nuevo directorio un fichero `pacakge.json` de un proyecto anterior y actualizarlo para el nuevo:
```bash
$ cp ../p09-funciones/package.json .
```
Actualizar los campos `name`, `description`, `author` del nuevo fichero.
Actualizar en los campos `devDependencies` y `dependencies` las dependencias específicas del nuevo proyecto.

1. Copiar igualmente un fichero `tsconfig.json` de otro proyecto y actualizarlo:
```bash
$ cp ../p09-funciones/tsconfig.json .
```
Actualizar el campo `outDir` con el directorio de salida para el nuevo proyecto

1. Copiar un fichero `vite.config.ts` de otro proyecto.
En este caso no hay nada que actualizar

1. Crear el directorio `src` y copiar en él (creando quizás subdirectorios) todo el código del nuevo proyecto
```bash
$ mkdir src
$ cd src
$ cp -R <directorio-otro-proyecto>/* .
```

1. Copiar al directorio raiz del nuevo proyecto (`new-project`) el fichero `index.html` del proyecto que se
está copiando:
```bash
cp <directorio-otro-proyecto>/otro-proyexto.html index.html
```
Actualizar en ese fichero `index.html` las direcciones de todos los recursos que carga (estilo, fichero
principal `*.ts`, fuentes, etc. (revisar todo el contenido de `<head>`)

1. Instalar las dependencias del nuevo proyecto:
```bash
$ npm install
```

1. Compilar el proyecto y corregir todos los posibles errores al transpilar:
```bash
$ npm run build
```

1.- Actualizar el repo incorporando el nuevo proyecto:
```bash
$ git add . ; git commit -m "nuevo proyecto"; git push
```




