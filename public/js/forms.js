const tagContainer = document.querySelector('.tag-container');
const button = document.getElementById('tagbutton')
const input = document.querySelector('.tag-container input');
const form = document.getElementById('formID');
const submit1 = document.getElementById('submit1');

let tags = [];

function createTag(label) {
  const div = document.createElement('div');
  div.setAttribute('class', 'tag');
  const span = document.createElement('span');
  span.innerHTML = label;
  const closeIcon = document.createElement('i');
  closeIcon.innerHTML = 'close';
  closeIcon.setAttribute('class', 'material-icons');
  closeIcon.setAttribute('data-item', label);
  div.appendChild(span);
  div.appendChild(closeIcon);
  return div;
}

function clearTags() {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.parentElement.removeChild(tag);
  });
}

function addTags() {
  clearTags();
  tags.slice().reverse().forEach(tag => {
    tagContainer.prepend(createTag(tag));
  });
}

button.addEventListener('click', (e) => {
      input.value.split(',').forEach(tag => {
        tags.push(tag);  
      });
      addTags();
      input.value = '';
});

document.addEventListener('click', (e) => {
  console.log(e.target.tagName);
  if (e.target.tagName === 'I') {
    const tagLabel = e.target.getAttribute('data-item');
    const index = tags.indexOf(tagLabel);
    tags = [...tags.slice(0, index), ...tags.slice(index+1)];
    addTags();    
  }
})

submit1.addEventListener('click',(e) => {
    const hiddenField = document.getElementById('skills');
      hiddenField.value = tags;
      console.log(hiddenField);
      document.getElementById("formID").submit();
}
)

document.addEventListener('DOMContentLoaded', (event)=>{
  var button = document.getElementById('tagbutton');
  button.click();
});

input.focus();