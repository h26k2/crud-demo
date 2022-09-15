
import {useEffect, useState,useRef} from 'react'

const App = () => {


    let [employees,setEmployees] = useState([]); 
    let [projects,setProjects] = useState([]);
    let [targetEmp,setTargetEmp] = useState(null)
    
    let projectInputField = useRef(null);
    useEffect(()=>{
        
        fetch('https://x8ki-letl-twmt.n7.xano.io/api:pVUTPOyX/employees').then((res)=>res.json()).then((data)=>{

            console.log('fetched employees details');
            setEmployees(data);

        }).catch((err)=>{   
            console.log('Error occured');
            console.log(err);
        })

        fetch('https://x8ki-letl-twmt.n7.xano.io/api:pVUTPOyX/projects').then((res)=>res.json()).then((data)=>{

            console.log('fetched projects details');
            setProjects(data);

        }).catch((err)=>{   
            console.log('Error occured');
            console.log(err);
        })
        
    },[])

    const showProject = (email) => {
        setTargetEmp(email);
    }

    const addProject = () => {
        
        let project = projectInputField.current.value;
        let email = targetEmp;

        fetch('https://x8ki-letl-twmt.n7.xano.io/api:pVUTPOyX/projects',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({project_name : project , emp_email : email})
        }).then((res)=>{
            if(res.status === 200){
                projectInputField.current.value = ''
                setProjects((prevState)=>{
                    return [...prevState,{project_name : project , emp_email : email}]
                })
            }
        }).catch((err)=>{
            console.log(err);
        })

    }

    const deleteProject  = (id) => {
        
        let requestURL = `https://x8ki-letl-twmt.n7.xano.io/api:pVUTPOyX/projects/${id}`

        fetch(requestURL,{
            method : 'DELETE',
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then((res)=>{
            if(res.status === 200){
                let newProjects = projects.map((p)=> p.id !== id)
                setProjects(newProjects);
            }
        }).catch((err)=>{
            console.log(err);
        })

    }

    const editProject = (id,email) => {

        let newVal = prompt('Enter project name to update');

        let updateURL = `https://x8ki-letl-twmt.n7.xano.io/api:pVUTPOyX/projects/${id}`;

        fetch(updateURL,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({project_name : newVal,emp_email : email})
        }).then((res)=> res.json()).then((updatedData)=>{
            
            let newProjects = projects.map((p)=> p.id !== id)
            newProjects.push(updatedData);
            setProjects(newProjects);

        }).catch((err)=>{
            console.log(err);
        })

    }

    return(
        <div className="app">
            
            <h2>Demo CRUD Operations for upwork client using XANO for the backend</h2>
            
            <div className='employees-details'>
                <h2>employees details</h2>
                
                {employees.length > 0 && (
                    <ul>
                        {employees.map((e)=>{
                            return <li key={e.id} onClick={()=>{showProject(e.email)}}>{e.name}</li>
                        })}
                    </ul>
                )}

            </div>

            <div className='projects-details'>
                <h2>project details</h2>
                <p>{(targetEmp === null) ? 'Please click any user name to check their projects' : null}</p>
                <ul>
                    {targetEmp && projects.map((p)=>{
                        return p.emp_email === targetEmp && <li key={p.id}> {p.project_name} <button onClick={()=>{deleteProject(p.id)}}>delete</button>  <button onClick={()=>{editProject(p.id,p.emp_email)}}>edit</button> </li>
                    })}
                </ul>
                {targetEmp && (
                    <div>
                        <code>adding projects for {targetEmp}</code> <br/>
                        <input type='text' placeholder='add a new project' ref={projectInputField}/>
                        <button onClick={addProject}>add project</button>
                    </div>
                )}
            </div>

        </div>
    )
}

export default App;