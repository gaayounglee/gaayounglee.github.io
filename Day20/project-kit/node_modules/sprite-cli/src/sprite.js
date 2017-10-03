let fs = require('fs')
let path = require('path')
let spritesmith = require('spritesmith')
let templater = require('spritesheet-templates')
let log = require('./log')
let chalk = require('chalk')

// template
let tpl = require(path.join(__dirname, 'templates/sprite'))
templater.addTemplate('sprite', tpl)

class CreateSprite {

  // constructor
  constructor() {

  }

  // run make
  run(options) {
    this.options = options

    this.printStart()
    this.initOptions(options)
    this.createSpriteImage(this.filterAssets())
  }

  // init config
  initOptions({
    styleFile,
    spriteFile,
    fix4Pieces,
    pieces,
    prefix,
    connector,
    processor,
    aPadding,
    aExtname,
    aAlgorithm,
    aFolder
  }) {

    let targetOptions = {
      styleFile: styleFile,
      spriteFile: spriteFile,
      fix4Pieces: fix4Pieces,
      styleTemplate: {
        format: 'sprite',
        pieces: pieces,
        formatOpts: {
          'cssClass': prefix,
          'connector': connector,
          'processor': processor
        }
      }
    }
    let options = {
      aPadding: aPadding,
      aExtname: aExtname,
      aAlgorithm: aAlgorithm,
      aFolder: aFolder,
      target: targetOptions,
    }
    this.initConstructor(options)
  }

  // init config into constructr
  initConstructor({
    aFolder,
    aPadding,
    aAlgorithm,
    aExtname = '.png|.jpg',
    target,
    formatFileName = function(filename) {
      return filename.replace('@', ':')
    }
  }) {
    this.aFolder = aFolder
    this.aPadding = aPadding
    this.aAlgorithm = aAlgorithm
    this.aExtname = aExtname

    this.tStyleFile = target.styleFile
    this.tSpriteFile = target.spriteFile
    this.tStyleTemplate = target.styleTemplate

    this.fix4Pieces = target.fix4Pieces

    this.formatFileName = formatFileName

    log.log("\nstart\n")
    log.info("assets:", "folder: " + this.aFolder)
    log.info("target:", "styleFile: " + this.tStyleFile)
    log.info("target:", "spriteFile: " + this.tSpriteFile)
    log.log()
  }

  // filter png/jpg images
  filterAssets() {
    return fs.readdirSync(this.aFolder).filter((item) => {
      if (path.normalize(path.join(this.aFolder, item)) == path.normalize(this.tSpriteFile))
        return false;
      
      let sName = item.split('.')[0]
      if (!sName) return false
      let tName = this.tSpriteFile.split("/").pop().split(".")[0]
      return item && path.extname(item) && this.aExtname.indexOf(path.extname(item)) > -1 && sName != tName
    }).map((item) => {
      return this.aFolder + '/' + item
    })
  }

  // make sprite
  createSpriteImage(files) {
    if (fs.existsSync(this.tSpriteFile))
      fs.unlinkSync(this.tSpriteFile)

    spritesmith.run(Object.assign({
      src: files
    }, {
      algorithm: this.aAlgorithm
    }, {
      padding: this.aPadding
    }), (err, {
      properties,
      coordinates,
      image
    }) => {

      log.info('spriteFile:', JSON.stringify(properties))
      log.log()

      for (let k in coordinates) {
        log.info(path.basename(k) + ":", JSON.stringify(coordinates[k]))
      }
      fs.writeFileSync(this.tSpriteFile, image)

      let imagemin = require('imagemin')

      // optimized
      // let imageminMozjpeg = require('imagemin-mozjpeg')
      // let imageminOptipng = require('imagemin-optipng')
      // let imageminPngout = require('imagemin-pngout')
      // let imageminPngquant = require('imagemin-pngquant')
      // let imageminAdvpng = require('imagemin-advpng')

      imagemin([this.tSpriteFile], path.join(this.tSpriteFile, "../"), {
        use: [
          // imageminMozjpeg(),
          // imageminPngquant(),
          // imageminPngout(),
          // imageminOptipng(),
          // imageminAdvpng()
        ]
      }).then(() => {
        log.log()
        log.log('Images optimized')
        log.info("create:", "spriteFile: " + this.tSpriteFile)

        this.createSpriteStyle(properties, coordinates)
      })

    })
  }

  // make sprite style
  createSpriteStyle(properties, coordinates) {
    let styles = templater({
      sprites: Object.keys(coordinates).map((key) => {
        return {
          name: this.formatFileName(path.basename(key).split('.')[0]),
          x: coordinates[key].x,
          y: coordinates[key].y,
          width: coordinates[key].width,
          height: coordinates[key].height,
        }
      }),
      spritesheet: {
        image: path.relative(path.join(this.tStyleFile, "../"), this.tSpriteFile),
        width: properties.width,
        height: properties.height,
        pieces: this.tStyleTemplate.pieces
      }
    }, this.tStyleTemplate)

    fs.writeFileSync(this.tStyleFile, (this.fix4Pieces || "") + "\n\n" + styles)
    log.info('create:', "styleFile: " + this.tStyleFile)
    this.printSuccess()
  }

  // success msg
  printSuccess() {
    let styleFilePath = `./${path.relative(process.cwd(), this.options.styleFile)}`
    let spriteFilePath = `./${path.relative(process.cwd(), this.options.spriteFile)}`
    let className = `${this.options.prefix + this.options.connector}your image name`

    let styleFileUnderline = chalk.underline(styleFilePath)
    let spriteImageUnderline = chalk.underline(spriteFilePath)
    let classNameBgBlack = chalk.bgBlack(className)
    log.success(`
Handle Success! 
  Build sprite styleFile in ${styleFileUnderline}
  Build sprite spriteImage in ${spriteImageUnderline}
  Import the styleFile in your style file(import only once)
  and use the '${classNameBgBlack}' as the class name
  You can join sprite as the predev/prerelease/prebuild...
  Happy coding!`)
  }

  // start msg
  printStart() {
    this.showLog = this.options.showLog || false
    if (!this.showLog) {
      let aFolderPath = `./${path.relative(process.cwd(), this.options.aFolder)}`
      let aFolderUnderline = chalk.underline(aFolderPath)
      let processorInverse = chalk.inverse(this.options.processor)

      console.log(`
Handle Start...
  Building from ${aFolderUnderline}
  and Building ${processorInverse} as the style processor`)
      log.log = function() {}
      log.info = function() {}
      log.error = function() {}
    }
  }
}

module.exports = CreateSprite
