package com.projet.service;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import com.poly.Person;

public class PersonServiceImpl implements PersonService {

    private static final EntityManagerFactory entityManagerFactory = 
        Persistence.createEntityManagerFactory("Projet-soa");

    @Override
    public List<Person> getAllPersons() {
        EntityManager em = entityManagerFactory.createEntityManager();
        try {
            return em.createQuery("SELECT p FROM Person p", Person.class).getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public boolean addPerson(Person p) {
        EntityManager em = entityManagerFactory.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(p);
            em.getTransaction().commit();
            System.out.println("Record inserted successfully");
            return true;
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            e.printStackTrace();
            return false;
        } finally {
            em.close();
        }
    }

    @Override
    public boolean deletePerson(int id) {
        EntityManager em = entityManagerFactory.createEntityManager();
        try {
            em.getTransaction().begin();
            Person person = em.find(Person.class, id); // ✅ Now matches int ID
            if (person == null) {
                System.out.println("Person not found with ID: " + id);
                return false;
            }
            em.remove(person);
            em.getTransaction().commit();
            System.out.println("Record deleted successfully");
            return true;
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            e.printStackTrace();
            return false;
        } finally {
            em.close();
        }
    }

    @Override
    public Person getPerson(int id) {
        EntityManager em = entityManagerFactory.createEntityManager();
        try {
            return em.find(Person.class, id); // ✅ Direct int match
        } finally {
            em.close();
        }
    }

    @Override
    public boolean updatePerson(Person p) {
        EntityManager em = entityManagerFactory.createEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(p);
            em.getTransaction().commit();
            System.out.println("Record updated successfully");
            return true;
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            e.printStackTrace();
            return false;
        } finally {
            em.close();
        }
    }
}