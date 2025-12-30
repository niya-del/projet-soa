
package com.projet.service;

import java.util.List;

import com.poly.Person;

public interface PersonService {
    List<Person> getAllPersons();
    Person getPerson(int id);
    boolean addPerson(Person p);
    boolean updatePerson(Person p);
    boolean deletePerson(int id);
}
