document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('submitted');
        
        //create new memory
        const formData = new FormData(form);

        //format date
        const currentDate = new Date().toLocaleDateString('en-US',{
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) + ' ' + new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

        const formDataObject = {
            title: formData.get('title'),
            date: currentDate, 
            description: formData.get('description'),
            author: formData.get('author'),
        }
        console.log(formDataObject);

        fetch('/memories', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        })
    })
    
    const memories = document.querySelectorAll('.memory');
    memories.forEach(memory => {
        const editButton = memory.querySelector('.edit_button');
        editButton.addEventListener('click', () => {
            console.log('edit post');

            //title input field
            const title = memory.querySelector('.title');
            const titleInput = document.createElement('input');
            titleInput.value = title.innerText;
            titleInput.name = 'title';
            titleInput.classList.add('title_input');
            title.innerHTML ='';
            title.appendChild(titleInput);

            //descrtiption input field
            const desc = memory.querySelector('.description');
            const descInput = document.createElement('input');
            descInput.value = desc.innerText;
            descInput.name = 'description';
            descInput.classList.add('desc_input');
            desc.innerHTML ='';
            desc.appendChild(descInput);

            //save button
            const saveButton = document.createElement('button');
            saveButton.classList.add('save_button');
            saveButton.innerText = 'Save';

            saveButton.addEventListener('click', () => {
                const editedDate = new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }) + ' ' + new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                });

                const originalDate = memory.querySelector('.date').innerText;
                const editedDateText = `${originalDate} (Edited at: ${editedDate})`;
                
                const updatedMemory = {
                    memoryID: memory.id, 
                    title: titleInput.value,
                    date: editedDateText, 
                    description: descInput.value,
                    author: memory.querySelector('.author').innerText
                }
                console.log(updatedMemory);
                updateMemory(updatedMemory);
            })
            memory.appendChild(saveButton);

        })
    }) 
});

function updateMemory(updatedMemory){
    fetch('/memories', {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMemory)
    })
}