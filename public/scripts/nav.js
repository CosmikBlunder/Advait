function navopen(){
    document.querySelector('body').classList.toggle('open');
    document.querySelector('.sidebar').classList.toggle('open');
    
}

function my404() {
    window.location.href = '/404';
}

document.getElementById('fileInput').addEventListener('change', function() {
    var fileName = this.value.split('\\').pop();
    document.querySelector('.file-name').textContent = fileName;
  });
  

function neki() {
    document.getElementById('contribute').addEventListener('click', function() {
        document.getElementById('content').scrollIntoView({ behavior: 'smooth' });
    });
};
  