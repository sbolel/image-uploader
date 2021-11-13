;(function (AWS) {
  'use strict'
  const name = atob('Y29tLnRoaW5rY3JhenkuaW9uaWNpbWFnZXVwbG9hZA==')
  const url = atob('aHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2NvbS50aGlua2NyYXp5LmlvbmljaW1hZ2V1cGxvYWQv')
  const region = 'us-east-1'
  const accessKeyId = atob('QUtJQVYzUUEyQ1RVTk03UFBNRVQ=')
  const secretAccessKey = atob('U3hBZ2hBdGVaUXJicVN0N28zdkdOaVBlSVpBR1hnWnhCNE9Sc3d3RQ==')
  const ServerSideEncryption = 'AES256'

  const defaultConfig = {
    name,
    url,
    region,
    accessKeyId,
    secretAccessKey,
    ServerSideEncryption,
  }

  const sizeLimit = 10485760  // 10MB in Bytes
  const sizeLabel = `${Math.round(sizeLimit/1024/1024)}MB`  // Bytes To MB string

  // Generate a unique string
  const uniqueString = () => {
    const randomString = Math.random().toString(36).substring(2, 15)
    const dateString = Date.now().toString(36)
    return `${dateString}${randomString}`
  }

  function ImageUploader(inputConfig = {}) {
    const config = {
      ...defaultConfig,
      ...inputConfig,
    }

    const {
      accessKeyId,
      name,
      url,
      region,
      secretAccessKey
    } = config

    // set aws config
    AWS.config.update({ accessKeyId, secretAccessKey, region })

    // set public properties
    this.name = name
    this.url = url
    this.error = null
    this.progress = 0

    // set aws bucket
    this.bucket = new AWS.S3({ params: { Bucket: name }})

    return this
  }

  ImageUploader.prototype = {
    validate: function (file) {
      // check that file exists
      if (!file || !file.size || file.size <= 0) {
        return { message: 'Invalid or missing file', code: 'Invalid File' }
      }

      // check that file size is below size limit
      if (Math.round(parseInt(file.size, 10)) > sizeLimit) {
        return {
          code: 'File Too Large',
          message: `Attachment too big. Max ${sizeLabel} allowed`,
        }
      }
    },

    setProgress: function (progress) {
      this.progress = progress
    },

    resetProgress: function () {
      setTimeout(() => ImageUploader.prototype.setProgress(0), 100)
    },

    push: function (file) {
      this.error = this.validate(file);
      if (this.error) {
        throw new Error(this.error.message)
      }

      const { name, type } = file
      const filename = encodeURI(`${uniqueString()}`)
      const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: this.name,
        ContentType: type,
        Key: filename,
        ServerSideEncryption,
      }

      this.setProgress(0)

      return new Promise((resolve, reject) => {
        this.bucket.putObject(params, (error, data) => {
          this.setProgress(0)
          if (error) {
            this.error = error
            return reject(this.error)
          }
          const updateData = { filename, url: `${this.url}${filename}` }
          return resolve({ ...data, ...updateData })
        })
        .on('httpUploadProgress', ({ loaded, total }) => {
          this.setProgress(Math.round((loaded / total) * 100))
        })
      })
    },
  }

  window.ImageUploader = ImageUploader
})(window.AWS)
