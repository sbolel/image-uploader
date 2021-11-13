(function() {
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ]

  const returnFileSize = (number) => {
    if (number < 1024) {
      return `${number}bytes`
    }
    if (number >= 1024 && number < 1048576) {
      return `${(number/1024).toFixed(1)}KB`
    }
    if (number >= 1048576) {
      return `${(number/1048576).toFixed(1)}MB`
    }
  }

  const getStatusEl = (content) => {
    const status = document.createElement('p')
    status.className = 'status'
    status.innerHTML = content
    return status
  }

  const getImageEl = (file) => {
    const image = document.createElement('img')
    image.src = URL.createObjectURL(file)
    return image
  }

  const clearPreview = () => {
    const preview =  document.querySelector('#preview')
    while(preview.firstChild) {
      preview.removeChild(preview.firstChild)
    }
  }

  const appendStatus = (text) => {
    const preview =  document.querySelector('#preview')
    preview.appendChild(getStatusEl(text))
  }

  const setStatus = (text) => {
    clearPreview()
    appendStatus(text)
  }

  function onLoad() {
    const input =  document.querySelector('#file')
    const preview =  document.querySelector('#preview')

    const validFileType = (file) => {
      return fileTypes.includes(file.type)
    }

    input.addEventListener('change', () => {
      const { files } = input

      clearPreview()

      if (files.length === 0) {
        setStatus('No files currently selected for upload')
      } else {
        const list = document.createElement('ul')
        preview.appendChild(list)

        for (const file of files) {
          const listItem = document.createElement('li')

          if (validFileType(file)) {
            listItem.appendChild(getImageEl(file))
            listItem.appendChild(getStatusEl(`File name: ${file.name} (${returnFileSize(file.size)})`))
          } else {
            listItem.appendChild(getStatusEl('⚠️ Not a valid file type.'))
          }

          list.appendChild(listItem)
        }
      }
    })
  }

  async function onSubmit(event) {
    event.preventDefault()

    if (!event.target[0].files.length) {
      setStatus('No files currently selected for upload')
    }

    const uploader = new window.ImageUploader()
    const [file] = event.target[0].files
    const { url } = await uploader.push(file)
    setStatus(`✅ File uploaded! <a href="${url}" target="_blank">View it</a>.`)
    console.log('✅ File uploaded!', url)
  }

  window.onLoad = onLoad
  window.onSubmit = onSubmit
})()
