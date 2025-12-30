package com.info.router; 

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

import com.poly.Person; 
import com.projet.service.PersonServiceImpl;

@Path("/personnes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RestRouter {

    PersonServiceImpl personService = new PersonServiceImpl();

    @GET
    public List<Person> getAllPersons() {
        return personService.getAllPersons();
    }

    @GET
    @Path("/id/{id}")
    public Person getPersonById(@PathParam("id") long id) {
        return personService.getPerson((int) id); // Cast long to int
    }

    @GET
    @Path("/nom/{nom}")
    public Person getPersonByNom(@PathParam("nom") String nom) {
        
        // Return null or throw exception since service doesn't support get by name
        throw new WebApplicationException("Method not implemented", 501);
    }

    @POST
    @Path("/add")
    public Person addPerson(Person person) {
        personService.addPerson(person);
        return person;
    }

    @PUT
    @Path("/update/{id}")
    public Person updatePerson(@PathParam("id") long id, Person person) {
        person.setId((int) id);
        personService.updatePerson(person);
        return person;
    }

    @DELETE
    @Path("/delete/{id}")
    public void deletePerson(@PathParam("id") long id) {
        personService.deletePerson((int) id);
    }
}