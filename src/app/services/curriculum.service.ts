import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {
  getCurriculum(curriculumId: string): Observable<any> {
    return this.firestore.collection('curriculum').doc(curriculumId).valueChanges();
  }
  
  constructor(private firestore: AngularFirestore) {}
  
  getCurriculumById(id: string) {
    return this.firestore.collection('curriculum').doc(id).valueChanges();
  }
// Método ya implementado en el CurriculumService
getCurriculums(userId: string): Observable<any[]> {
  return this.firestore
    .collection('curriculum', (ref) => ref.where('userId', '==', userId))
    .valueChanges({ idField: 'id' }); // Incluye el ID del documento
} 
updateCurriculum(id: string, data: any) {
  return this.firestore.collection('curriculum').doc(id).update(data);
}

  // Método para eliminar un currículum
  deleteCurriculum(curriculumId: string): Promise<void> {
    return this.firestore.collection('curriculum').doc(curriculumId).delete();
  }

  // Método para descargar un PDF (puedes personalizar esta parte según tu necesidad)
  downloadPdf(curriculumId: string): Observable<any> {
    // Lógica para descargar el PDF
    return this.firestore.collection('curriculum').doc(curriculumId).get();
  }
}
 